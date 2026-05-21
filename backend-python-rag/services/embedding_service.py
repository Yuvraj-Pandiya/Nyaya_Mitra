"""
services/embedding_service.py
------------------------------
Wraps the Google Gemini `text-embedding-004` model via
langchain_google_genai.GoogleGenerativeAIEmbeddings.

Provides a single public function:
    embed_chunks(chunks) -> list[list[float]]

The task_type is set to "RETRIEVAL_DOCUMENT" for ingestion so that the
vectors are tuned for document-side retrieval (the query side will use
"RETRIEVAL_QUERY" in the RAG/search phase).
"""

import os
# pyrefly: ignore [missing-import]
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
            model="models/gemini-embedding-2",
            google_api_key=api_key,
            task_type="RETRIEVAL_DOCUMENT",
            output_dimensionality=768,
        )
    return _embedder

def embed_chunks(chunks: list[dict]) -> list[list[float]]:
    """
    Generates one embedding per chunk.
    """

    embedder = _get_embedder()

    vectors = []

    for chunk in chunks:
        vector = embedder.embed_query(chunk["text"])
        vectors.append(vector)

    print("Chunks:", len(chunks))
    print("Vectors:", len(vectors))

    return vectors