"""
services/embedding_service.py
------------------------------
Wraps the Google Gemini `models/embedding-001` model via
langchain_google_genai.GoogleGenerativeAIEmbeddings.

Provides a single public function:
    embed_chunks(chunks) -> list[list[float]]

The task_type is set to "RETRIEVAL_DOCUMENT" for ingestion so that the
vectors are tuned for document-side retrieval (the query side will use
"RETRIEVAL_QUERY" in the RAG/search phase).
"""

import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings

_embedder: GoogleGenerativeAIEmbeddings | None = None


def _get_embedder() -> GoogleGenerativeAIEmbeddings:
    global _embedder
    if _embedder is None:
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise EnvironmentError(
                "GOOGLE_API_KEY or GEMINI_API_KEY must be set in the environment."
            )
        _embedder = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=api_key,
            task_type="RETRIEVAL_DOCUMENT",
        )
    return _embedder


def embed_chunks(chunks: list[dict]) -> list[list[float]]:
    """
    Embeds a list of chunk dicts (each having a "text" key).

    Parameters
    ----------
    chunks : list[dict]
        Output of chunking_service.chunk_text()

    Returns
    -------
    list[list[float]]
        One embedding vector per chunk (1 536 dimensions for embedding-001).
    """
    embedder = _get_embedder()
    texts = [c["text"] for c in chunks]

    # embed_documents batches internally; returns list[list[float]]
    vectors: list[list[float]] = embedder.embed_documents(texts)
    return vectors
