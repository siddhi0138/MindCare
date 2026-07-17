from google.genai import types

# Mirrors the categories in src/pages/MeditationPage.tsx so recommendations stay groundable
MEDITATION_CATEGORIES = {
    "morning": "Morning Calm — start the day with clarity and peace",
    "sleep": "Deep Sleep — drift into restful sleep with gentle sounds",
    "anxiety": "Anxiety Relief — release tension and find your center",
    "breathing": "Breathing Focus — guided breathing to calm your mind",
    "focus": "Mindful Focus — sharpen attention and stay grounded",
    "quick": "Quick Calm — a short session for fast relief",
}

MOOD_LABELS = ["very_low", "low", "neutral", "good", "great"]

CHAT_TOOLS = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="save_journal_entry",
            description=(
                "Save a journal entry on the user's behalf when they explicitly ask you to "
                "write down, log, or save a thought, feeling, or reflection."
            ),
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "entry_text": types.Schema(type=types.Type.STRING, description="The journal entry content"),
                    "mood": types.Schema(type=types.Type.STRING, enum=MOOD_LABELS),
                },
                required=["entry_text", "mood"],
            ),
        ),
        types.FunctionDeclaration(
            name="get_recent_mood_summary",
            description=(
                "Look up the user's recent logged mood check-ins when answering a question "
                "that depends on how they've been feeling lately (e.g. 'how have I been doing?')."
            ),
            parameters=types.Schema(type=types.Type.OBJECT, properties={}),
        ),
        types.FunctionDeclaration(
            name="recommend_meditation",
            description="Recommend one specific guided meditation session from the app's library.",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "category": types.Schema(type=types.Type.STRING, enum=list(MEDITATION_CATEGORIES.keys())),
                },
                required=["category"],
            ),
        ),
        types.FunctionDeclaration(
            name="request_therapist_referral",
            description=(
                "Connect the user to the in-app therapist directory, filtered by specialty, "
                "when they ask for professional help or a referral to a licensed therapist."
            ),
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "specialty": types.Schema(
                        type=types.Type.STRING,
                        description="e.g. Anxiety, Depression, Trauma, Stress, Grief, Relationships",
                    ),
                },
                required=["specialty"],
            ),
        ),
    ]
)

# Data tools: resolved server-side, their result is fed back to Gemini for a grounded final answer
DATA_TOOLS = {"get_recent_mood_summary", "recommend_meditation"}

# Action tools: Gemini only signals intent here; the authenticated frontend performs the real
# side effect (Firestore write / navigation) since the backend has no Firestore write access
ACTION_TOOLS = {"save_journal_entry", "request_therapist_referral"}


def dispatch_function_calls(function_calls, mood_context: dict | None):
    """Resolves a batch of Gemini function calls. Data tools are answered immediately
    (their result gets fed back to Gemini for a grounded reply); action tools are only
    acknowledged here and returned as pending_actions for the authenticated frontend to
    actually execute against Firestore."""
    response_parts = []
    pending_actions = []
    for fc in function_calls:
        args = fc.args or {}
        if fc.name in DATA_TOOLS:
            data = resolve_data_tool(fc.name, args, mood_context)
            response_parts.append(types.Part.from_function_response(name=fc.name, response=data))
        elif fc.name in ACTION_TOOLS:
            pending_actions.append({"name": fc.name, "args": args})
            response_parts.append(
                types.Part.from_function_response(name=fc.name, response={"status": "acknowledged"})
            )
        else:
            response_parts.append(types.Part.from_function_response(name=fc.name, response={"status": "unknown_tool"}))
    return response_parts, pending_actions


def resolve_data_tool(name: str, args: dict, mood_context: dict | None) -> dict:
    if name == "get_recent_mood_summary":
        if not mood_context or mood_context.get("avg_mood") is None:
            return {"status": "no_data", "message": "No mood check-ins logged yet."}
        return {
            "status": "ok",
            "average_mood_0_to_4": mood_context.get("avg_mood"),
            "recent_moods_0_to_4": mood_context.get("recent_moods", []),
        }

    if name == "recommend_meditation":
        category = args.get("category")
        description = MEDITATION_CATEGORIES.get(category)
        if not description:
            return {"status": "not_found"}
        return {"status": "ok", "category": category, "session": description}

    return {"status": "unknown_tool"}
