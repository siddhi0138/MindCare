import os
from contextlib import contextmanager

from dotenv import load_dotenv

load_dotenv()

LANGFUSE_PUBLIC_KEY = os.getenv("LANGFUSE_PUBLIC_KEY")
LANGFUSE_SECRET_KEY = os.getenv("LANGFUSE_SECRET_KEY")
LANGFUSE_HOST = os.getenv("LANGFUSE_HOST", "https://cloud.langfuse.com")

_client = None
if LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY:
    from langfuse import Langfuse

    _client = Langfuse(
        public_key=LANGFUSE_PUBLIC_KEY,
        secret_key=LANGFUSE_SECRET_KEY,
        host=LANGFUSE_HOST,
    )


def is_enabled() -> bool:
    return _client is not None


def usage_details_from_gemini(result) -> dict:
    usage = result.usage_metadata
    return {
        "input": usage.prompt_token_count or 0,
        "output": usage.candidates_token_count or 0,
        "total": usage.total_token_count or 0,
    }


@contextmanager
def trace_generation(name: str, model: str, input_data, metadata: dict | None = None):
    """Traces a single Gemini call (prompt, latency, tokens, errors) in Langfuse.
    No-ops cleanly when LANGFUSE_PUBLIC_KEY/LANGFUSE_SECRET_KEY aren't configured,
    so tracing is opt-in and never blocks the request path."""
    if _client is None:
        yield None
        return

    with _client.start_as_current_observation(
        name=name, as_type="generation", input=input_data, model=model, metadata=metadata
    ) as generation:
        try:
            yield generation
        except Exception as e:
            generation.update(level="ERROR", status_message=str(e))
            raise
