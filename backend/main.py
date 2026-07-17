import json
import os
from pathlib import Path
from typing import Literal

import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from google import genai
from google.genai import types
from pydantic import BaseModel

import email_service
import gmail_service
from analytics import build_recommendation, classify_emotion, predict_mood_trend
from crisis import CRISIS_RESPONSE, assess_risk
from observability import trace_generation, usage_details_from_gemini
from prompts import SYSTEM_PROMPT
from rag import KnowledgeBase, extract_pdf_text
from report import generate_assessment_report_pdf
from tools import CHAT_TOOLS, dispatch_function_calls
from wellness_predictor import predict as predict_wellness_risk

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set. Add it to backend/.env")

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_NAME = "gemini-3.1-flash-lite"

BACKEND_DIR = Path(__file__).parent
KB_DIR = BACKEND_DIR / "knowledge_base"
UPLOADS_DIR = KB_DIR / "uploads"

WELLNESS_DATASET = pd.read_csv(BACKEND_DIR / "ml" / "data" / "synthetic_wellness_dataset.csv")

kb = KnowledgeBase(client)
kb.load_directory(KB_DIR)

app = FastAPI(title="MindCare AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-mental-buddy.web.app",
        "https://your-mental-buddy.firebaseapp.com",
    ],
    allow_origin_regex=r"http://localhost:\d+",
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: Literal["user", "model"]
    content: str


class MoodContext(BaseModel):
    avg_mood: float | None = None
    recent_moods: list[int] = []


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []
    mood_context: MoodContext | None = None


class ChatResponse(BaseModel):
    response: str
    crisis: bool = False
    sources: list[str] = []
    tool_calls: list[dict] = []


class UploadResponse(BaseModel):
    filename: str
    chunks_added: int
    total_chunks: int


class EmotionRequest(BaseModel):
    message: str


class EmotionResponse(BaseModel):
    emotion: str
    confidence: float


class RecommendationRequest(BaseModel):
    emotion_counts: dict[str, int] = {}
    avg_mood: float | None = None


class RecommendationResponse(BaseModel):
    tool: str
    reason: str


class MoodPredictionRequest(BaseModel):
    # Frontend sends one value per day (same-day check-ins averaged), so this can be fractional
    mood_values: list[float]


class MoodPredictionResponse(BaseModel):
    trend: str
    risk_probability: float
    explanation: str


class WellnessRiskRequest(BaseModel):
    age: int
    gender: Literal["Male", "Female", "Other"]
    region: Literal["North America", "Europe", "Asia", "Africa", "South America"]
    sleep_duration: float
    exercise_frequency: int
    social_media_usage: float
    work_hours: int
    financial_stress: Literal["Yes", "No"]
    relationship_issues: Literal["Yes", "No"]
    support_system: int
    self_care_activities: int


class RiskScore(BaseModel):
    score: float
    level: str


class WellnessRiskResponse(BaseModel):
    stress: RiskScore
    anxiety: RiskScore
    depression: RiskScore


class ReportEntry(BaseModel):
    type: str
    score: float
    level: str
    timestamp: str
    recommendations: list[str] = []


class ReportRequest(BaseModel):
    user_name: str
    entries: list[ReportEntry]


class EmailReportRequest(ReportRequest):
    recipient_email: str


def build_augmented_message(message: str, k: int = 4):
    retrieved = kb.search(message, k=k)
    outgoing_message = message
    if retrieved:
        context_block = "\n\n".join(f"[{c.source}] {c.text}" for c in retrieved)
        outgoing_message = (
            "Relevant reference material from the mental health knowledge base "
            "(use it only if it's actually helpful for answering the question below, "
            "otherwise rely on your own knowledge):\n"
            f"{context_block}\n\n"
            f"User question: {message}"
        )
    sources = sorted({c.source for c in retrieved})
    return outgoing_message, sources


def build_gemini_history(history: list[ChatMessage]):
    return [
        types.Content(role=m.role, parts=[types.Part(text=m.content)])
        for m in history[-10:]
    ]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/kb-status")
def kb_status():
    return {"total_chunks": kb.size()}


@app.get("/wellness-dataset-sample")
def wellness_dataset_sample(n: int = 300):
    n = min(n, len(WELLNESS_DATASET))
    sample = WELLNESS_DATASET.sample(n=n, random_state=42)
    return sample.to_dict(orient="records")


@app.post("/upload-pdf", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()
    text = extract_pdf_text(file_bytes)
    if not text.strip():
        raise HTTPException(status_code=422, detail="Could not extract any text from this PDF")

    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    (UPLOADS_DIR / f"{Path(file.filename).stem}.txt").write_text(text, encoding="utf-8")

    chunks_added = kb.add_document(text, source=file.filename)
    return UploadResponse(filename=file.filename, chunks_added=chunks_added, total_chunks=kb.size())


@app.post("/analyze-emotion", response_model=EmotionResponse)
def analyze_emotion(req: EmotionRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="message cannot be empty")

    try:
        result = classify_emotion(client, MODEL_NAME, req.message)
        return EmotionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Emotion classification failed: {e}")


@app.post("/recommend", response_model=RecommendationResponse)
def recommend(req: RecommendationRequest):
    try:
        result = build_recommendation(client, MODEL_NAME, req.emotion_counts, req.avg_mood)
        return RecommendationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Recommendation failed: {e}")


@app.post("/predict-mood", response_model=MoodPredictionResponse)
def predict_mood(req: MoodPredictionRequest):
    result = predict_mood_trend(req.mood_values)
    return MoodPredictionResponse(**result)


@app.post("/predict-wellness-risk", response_model=WellnessRiskResponse)
def predict_wellness_risk_endpoint(req: WellnessRiskRequest):
    result = predict_wellness_risk(
        {
            "Age": req.age,
            "Gender": req.gender,
            "Region": req.region,
            "Sleep_Duration": req.sleep_duration,
            "Exercise_Frequency": req.exercise_frequency,
            "Social_Media_Usage": req.social_media_usage,
            "Work_Hours": req.work_hours,
            "Financial_Stress": req.financial_stress,
            "Relationship_Issues": req.relationship_issues,
            "Support_System": req.support_system,
            "Self_Care_Activities": req.self_care_activities,
        }
    )
    return WellnessRiskResponse(**result)


def is_email_configured() -> bool:
    return gmail_service.is_configured() or email_service.is_configured()


def send_email(to_email: str, subject: str, body: str) -> None:
    if gmail_service.is_configured():
        gmail_service.send_email(to_email=to_email, subject=subject, body=body)
    else:
        email_service.send_email(to_email=to_email, subject=subject, body=body)


def send_email_with_attachment(
    to_email: str, subject: str, body: str, attachment_bytes: bytes, attachment_filename: str
) -> None:
    if gmail_service.is_configured():
        gmail_service.send_email_with_attachment(
            to_email=to_email,
            subject=subject,
            body=body,
            attachment_bytes=attachment_bytes,
            attachment_filename=attachment_filename,
        )
    else:
        email_service.send_email_with_attachment(
            to_email=to_email,
            subject=subject,
            body=body,
            attachment_bytes=attachment_bytes,
            attachment_filename=attachment_filename,
        )


@app.get("/email-status")
def email_status():
    return {"configured": is_email_configured()}


class NotificationEmailRequest(BaseModel):
    recipient_email: str
    subject: str
    body: str


@app.post("/send-notification-email")
def send_notification_email_endpoint(req: NotificationEmailRequest):
    if not is_email_configured():
        raise HTTPException(
            status_code=503,
            detail="Email sending isn't configured on the server yet. Add GMAIL_* or RESEND_API_KEY to backend/.env",
        )
    try:
        send_email(to_email=req.recipient_email, subject=req.subject, body=req.body)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to send email: {e}")
    return {"success": True}


@app.post("/generate-report-pdf")
def generate_report_pdf_endpoint(req: ReportRequest):
    pdf_bytes = generate_assessment_report_pdf(req.user_name, [e.model_dump() for e in req.entries])
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=mindcare_assessment_report.pdf"},
    )


@app.post("/send-report-email")
def send_report_email_endpoint(req: EmailReportRequest):
    if not is_email_configured():
        raise HTTPException(
            status_code=503,
            detail="Email sending isn't configured on the server yet. Add GMAIL_* or RESEND_API_KEY to backend/.env",
        )

    pdf_bytes = generate_assessment_report_pdf(req.user_name, [e.model_dump() for e in req.entries])

    try:
        send_email_with_attachment(
            to_email=req.recipient_email,
            subject="Your MindCare Assessment Report",
            body=(
                f"Hi {req.user_name},\n\n"
                "Attached is your latest mental wellness assessment report from MindCare.\n\n"
                "This report is for informational purposes only and is not a clinical diagnosis.\n\n"
                "Take care,\nThe MindCare Team"
            ),
            attachment_bytes=pdf_bytes,
            attachment_filename="mindcare_assessment_report.pdf",
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to send email: {e}")

    return {"success": True}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="message cannot be empty")

    if assess_risk(req.message):
        return ChatResponse(response=CRISIS_RESPONSE, crisis=True)

    gemini_history = build_gemini_history(req.history)
    outgoing_message, sources = build_augmented_message(req.message)

    mood_context = req.mood_context.model_dump() if req.mood_context else None

    try:
        chat = client.chats.create(
            model=MODEL_NAME,
            config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT, tools=[CHAT_TOOLS]),
            history=gemini_history,
        )
        with trace_generation("chat", MODEL_NAME, outgoing_message, metadata={"rag_sources": sources}) as generation:
            result = chat.send_message(outgoing_message)
            pending_actions: list[dict] = []

            for _ in range(4):  # bounded tool-calling loop
                if not result.function_calls:
                    break
                response_parts, new_actions = dispatch_function_calls(result.function_calls, mood_context)
                pending_actions.extend(new_actions)
                result = chat.send_message(response_parts)

            if generation:
                generation.update(output=result.text, usage_details=usage_details_from_gemini(result))

        return ChatResponse(response=result.text, sources=sources, tool_calls=pending_actions)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {e}")


@app.post("/chat/stream")
def chat_stream(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="message cannot be empty")

    def event_stream():
        if assess_risk(req.message):
            yield json.dumps({"type": "meta", "crisis": True, "sources": []}) + "\n"
            yield json.dumps({"type": "chunk", "text": CRISIS_RESPONSE}) + "\n"
            yield json.dumps({"type": "done"}) + "\n"
            return

        gemini_history = build_gemini_history(req.history)
        outgoing_message, sources = build_augmented_message(req.message)

        yield json.dumps({"type": "meta", "crisis": False, "sources": sources}) + "\n"

        mood_context = req.mood_context.model_dump() if req.mood_context else None

        try:
            chat = client.chats.create(
                model=MODEL_NAME,
                config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT, tools=[CHAT_TOOLS]),
                history=gemini_history,
            )
            with trace_generation(
                "chat-stream", MODEL_NAME, outgoing_message, metadata={"rag_sources": sources}
            ) as generation:
                full_text = ""
                pending_actions: list[dict] = []
                next_message = outgoing_message

                for _ in range(4):  # bounded tool-calling loop
                    collected_calls = []
                    for chunk in chat.send_message_stream(next_message):
                        if chunk.function_calls:
                            collected_calls.extend(chunk.function_calls)
                        elif chunk.text:
                            full_text += chunk.text
                            yield json.dumps({"type": "chunk", "text": chunk.text}) + "\n"

                    if not collected_calls:
                        break

                    for fc in collected_calls:
                        yield json.dumps({"type": "tool_call", "name": fc.name, "args": fc.args or {}}) + "\n"

                    response_parts, new_actions = dispatch_function_calls(collected_calls, mood_context)
                    pending_actions.extend(new_actions)
                    next_message = response_parts

                if generation:
                    generation.update(output=full_text)

            if pending_actions:
                yield json.dumps({"type": "actions", "actions": pending_actions}) + "\n"
            yield json.dumps({"type": "done"}) + "\n"
        except Exception as e:
            yield json.dumps({"type": "error", "detail": str(e)}) + "\n"

    return StreamingResponse(event_stream(), media_type="application/x-ndjson")
