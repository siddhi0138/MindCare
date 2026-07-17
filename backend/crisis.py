import re

_CRISIS_PATTERNS = [
    r"\bkill(ing)?\s+myself\b",
    r"\bend(ing)?\s+my\s+life\b",
    r"\bwant\s+to\s+die\b",
    r"\bsuicid(e|al)\b",
    r"\bno\s+reason\s+to\s+live\b",
    r"\bcan'?t\s+go\s+on\b",
    r"\bself[\s-]?harm\b",
    r"\bcut(ting)?\s+myself\b",
    r"\bhurt(ing)?\s+myself\b",
    r"\bharm(ing)?\s+myself\b",
    r"\bbetter\s+off\s+dead\b",
    r"\bdon'?t\s+want\s+to\s+(be\s+alive|live)\b",
    r"\boverdose\b",
    r"\bkill\s+(someone|him|her|them)\b",
    r"\bhurt\s+(someone|somebody|others)\b",
]

_COMPILED = [re.compile(p, re.IGNORECASE) for p in _CRISIS_PATTERNS]


def assess_risk(message: str) -> bool:
    """Fast rule-based first-pass filter. Deliberately runs before the LLM
    so a crisis message never depends on the model choosing to be safe."""
    return any(pattern.search(message) for pattern in _COMPILED)


CRISIS_RESPONSE = """I'm really glad you told me this, and I want you to know your safety matters more than anything else right now.

I'm not able to provide crisis counseling, but please reach out to one of these right now — you don't have to go through this alone:

**India**
- AASRA: +91-9820466726 (24/7)
- iCall: +91-9152987821 (Mon-Sat, 8am-10pm)
- Kiran Mental Health Helpline: 1800-599-0019 (24/7, toll-free)

**International**
- 988 Suicide & Crisis Lifeline (US): call or text 988
- Samaritans (UK & Ireland): 116 123
- Full directory: https://www.iasp.info/resources/Crisis_Centres/

If you're in immediate danger, please call your local emergency number right now, or use the SOS button in this app.

Would you be willing to reach out to one of these right now, or is there someone you trust nearby who can stay with you?"""
