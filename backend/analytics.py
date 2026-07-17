import json

from google import genai
from google.genai import types

from observability import trace_generation, usage_details_from_gemini

EMOTION_LABELS = ["joy", "calm", "sadness", "anxiety", "stress", "anger", "fear", "neutral"]

RECOMMENDABLE_TOOLS = [
    "Guided Meditation",
    "Breathing Exercise",
    "Grounding Exercise",
    "Journaling",
    "Coping Tools",
    "Therapist Directory",
]

EMOTION_SCHEMA = types.Schema(
    type=types.Type.OBJECT,
    properties={
        "emotion": types.Schema(type=types.Type.STRING, enum=EMOTION_LABELS),
        "confidence": types.Schema(type=types.Type.NUMBER),
    },
    required=["emotion", "confidence"],
)

RECOMMENDATION_SCHEMA = types.Schema(
    type=types.Type.OBJECT,
    properties={
        "tool": types.Schema(type=types.Type.STRING, enum=RECOMMENDABLE_TOOLS),
        "reason": types.Schema(type=types.Type.STRING),
    },
    required=["tool", "reason"],
)


def classify_emotion(client: genai.Client, model_name: str, message: str) -> dict:
    prompt = (
        "Classify the dominant emotion expressed in this message from a mental "
        f"wellness app user. Choose exactly one emotion from: {', '.join(EMOTION_LABELS)}.\n\n"
        f'Message: "{message}"'
    )
    with trace_generation("analyze-emotion", model_name, message) as generation:
        result = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=EMOTION_SCHEMA,
            ),
        )
        if generation:
            generation.update(output=result.text, usage_details=usage_details_from_gemini(result))

    data = json.loads(result.text)
    return {
        "emotion": data["emotion"],
        "confidence": max(0.0, min(1.0, float(data["confidence"]))),
    }


def build_recommendation(
    client: genai.Client, model_name: str, emotion_counts: dict[str, int], avg_mood: float | None
) -> dict:
    total = sum(emotion_counts.values())
    stats_summary = (
        ", ".join(f"{k}: {v}/{total}" for k, v in sorted(emotion_counts.items(), key=lambda kv: -kv[1]))
        if total
        else "no recent emotion data"
    )
    mood_summary = f"{avg_mood:.1f}/4" if avg_mood is not None else "no recent mood check-ins"

    prompt = (
        "Based on this user's recent mental wellness signals, recommend exactly one tool "
        f"from this list: {', '.join(RECOMMENDABLE_TOOLS)}.\n\n"
        f"Recent emotion breakdown from chat messages: {stats_summary}\n"
        f"Average self-reported mood (0=very low, 4=great): {mood_summary}\n\n"
        "Write a one-sentence reason that references the actual data above "
        "(e.g. a specific emotion frequency or the mood average), not generic advice."
    )
    with trace_generation("recommend", model_name, prompt) as generation:
        result = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=RECOMMENDATION_SCHEMA,
            ),
        )
        if generation:
            generation.update(output=result.text, usage_details=usage_details_from_gemini(result))

    return json.loads(result.text)


def predict_mood_trend(mood_values: list[float]) -> dict:
    """Deterministic, explainable heuristic: compares the average of the most
    recent third of check-ins against the earliest third. Not a trained model —
    with the small per-user data volumes here, a trend heuristic is more honest
    and more explainable than a black-box classifier would be."""
    n = len(mood_values)
    if n < 4:
        remaining = 4 - n
        explanation = (
            f"You have {n} mood check-in{'s' if n != 1 else ''} so far — log "
            f"{remaining} more to unlock a trend forecast."
            if n > 0
            else "No mood check-ins yet. Log your mood (Home page or a journal entry) to unlock a trend forecast after 4 check-ins."
        )
        return {
            "trend": "insufficient_data",
            "risk_probability": 0.0,
            "explanation": explanation,
        }

    third = max(1, n // 3)
    earliest = mood_values[:third]
    recent = mood_values[-third:]
    earliest_avg = sum(earliest) / len(earliest)
    recent_avg = sum(recent) / len(recent)
    delta = recent_avg - earliest_avg

    # Mood scale is 0-4, so a full-scale swing maps to 1.0 probability
    risk_probability = round(min(1.0, abs(delta) / 4), 2)

    if delta <= -0.4:
        trend = "declining"
        explanation = (
            f"Your average mood dropped from {earliest_avg:.1f} to {recent_avg:.1f} "
            "(scale 0-4) across your recent check-ins. Consider reaching out to a "
            "coping tool or talking to someone you trust."
        )
    elif delta >= 0.4:
        trend = "improving"
        explanation = (
            f"Your average mood rose from {earliest_avg:.1f} to {recent_avg:.1f} "
            "(scale 0-4) across your recent check-ins. Keep up whatever's working."
        )
    else:
        trend = "stable"
        explanation = (
            f"Your mood has stayed fairly steady (around {recent_avg:.1f}/4) "
            "across your recent check-ins."
        )

    return {"trend": trend, "risk_probability": risk_probability, "explanation": explanation}
