"""
core/vector_store.py
--------------------
HTTP client wrapper around a ChromaDB Docker server.
Connects to chromadb/chroma running as a Docker container.

No local compilation required — all vector operations happen server-side.
"""

import os
import chromadb

# ── Singleton client + collection ─────────────────────────────────────────────
_client = None
_collection = None

COLLECTION_NAME = "legal_documents"


def _get_client():
    global _client
    if _client is None:
        host = os.getenv("CHROMA_HOST", "localhost")
        port = int(os.getenv("CHROMA_PORT", "8001"))
        _client = chromadb.HttpClient(host=host, port=port)
        # Quick connectivity check
        _client.heartbeat()
    return _client


def get_collection():
    """
    Returns (and lazily creates) the ChromaDB collection.
    Uses cosine distance — ideal for semantic similarity search.
    """
    global _collection
    if _collection is None:
        client = _get_client()
        _collection = client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def collection_stats() -> dict:
    """Return basic stats about the collection (count of stored chunks)."""
    col = get_collection()
    host = os.getenv("CHROMA_HOST", "localhost")
    port = os.getenv("CHROMA_PORT", "8001")
    return {
        "collection": COLLECTION_NAME,
        "total_chunks": col.count(),
        "chroma_server": f"http://{host}:{port}",
    }
