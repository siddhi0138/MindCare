import os
from dataclasses import dataclass
from pathlib import Path

import faiss
import numpy as np
from google import genai
from google.genai import types
from pypdf import PdfReader

EMBED_MODEL = "models/gemini-embedding-001"
EMBED_DIM = 768
CHUNK_SIZE = 800
CHUNK_OVERLAP = 150


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    text = " ".join(text.split())
    if not text:
        return []

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return chunks


def extract_pdf_text(file_bytes: bytes) -> str:
    from io import BytesIO

    reader = PdfReader(BytesIO(file_bytes))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


@dataclass
class Chunk:
    text: str
    source: str


class KnowledgeBase:
    def __init__(self, client: genai.Client):
        self._client = client
        self._index = faiss.IndexFlatIP(EMBED_DIM)
        self._chunks: list[Chunk] = []

    def size(self) -> int:
        return len(self._chunks)

    def _embed(self, texts: list[str], task_type: str) -> np.ndarray:
        result = self._client.models.embed_content(
            model=EMBED_MODEL,
            contents=texts,
            config=types.EmbedContentConfig(
                output_dimensionality=EMBED_DIM, task_type=task_type
            ),
        )
        vectors = np.array([e.values for e in result.embeddings], dtype="float32")
        faiss.normalize_L2(vectors)
        return vectors

    def add_document(self, text: str, source: str) -> int:
        pieces = chunk_text(text)
        if not pieces:
            return 0

        vectors = self._embed(pieces, task_type="RETRIEVAL_DOCUMENT")
        self._index.add(vectors)
        self._chunks.extend(Chunk(text=p, source=source) for p in pieces)
        return len(pieces)

    def load_directory(self, directory: Path) -> None:
        txt_files = sorted(directory.glob("**/*.txt"))
        for path in txt_files:
            self.add_document(path.read_text(encoding="utf-8"), source=path.stem)

    def search(self, query: str, k: int = 4) -> list[Chunk]:
        if self.size() == 0:
            return []

        query_vector = self._embed([query], task_type="RETRIEVAL_QUERY")
        scores, indices = self._index.search(query_vector, min(k, self.size()))
        return [self._chunks[i] for i in indices[0] if i != -1]
