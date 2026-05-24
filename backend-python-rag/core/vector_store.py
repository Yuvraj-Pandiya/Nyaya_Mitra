"""
core/vector_store.py
--------------------
PostgreSQL pgvector implementation of the vector store.
Replaces ChromaDB to use the centralized Supabase database.
"""

import os
import json
import psycopg2
from psycopg2.extras import Json
from pgvector.psycopg2 import register_vector
from dotenv import load_dotenv

load_dotenv()

class PgVectorCollection:
    def __init__(self):
        self.db_url = os.getenv("SUPABASE_DB_URL")
        if not self.db_url:
            raise ValueError("SUPABASE_DB_URL is not set in environment")
            
    def _get_conn(self):
        conn = psycopg2.connect(self.db_url)
        register_vector(conn)
        return conn

    def count(self) -> int:
        with self._get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT COUNT(*) FROM document_embeddings")
                return cur.fetchone()[0]

    def upsert(self, ids: list[str], embeddings: list[list[float]], documents: list[str], metadatas: list[dict]):
        with self._get_conn() as conn:
            with conn.cursor() as cur:
                for _id, emb, doc, meta in zip(ids, embeddings, documents, metadatas):
                    cur.execute(
                        """
                        INSERT INTO document_embeddings (id, embedding, document, metadata)
                        VALUES (%s, %s, %s, %s)
                        ON CONFLICT (id) DO UPDATE SET
                            embedding = EXCLUDED.embedding,
                            document = EXCLUDED.document,
                            metadata = EXCLUDED.metadata,
                            created_at = NOW()
                        """,
                        (_id, emb, doc, Json(meta))
                    )
            conn.commit()

    def query(self, query_embeddings: list[list[float]], n_results: int, include: list[str] = None):
        # We only support one query embedding in this mock
        query_emb = query_embeddings[0]
        
        with self._get_conn() as conn:
            with conn.cursor() as cur:
                # pgvector cosine distance is <=>. We order by it.
                # cosine similarity = 1 - cosine distance
                cur.execute(
                    """
                    SELECT document, metadata, embedding <=> %s AS distance
                    FROM document_embeddings
                    ORDER BY distance
                    LIMIT %s
                    """,
                    (query_emb, n_results)
                )
                rows = cur.fetchall()
                
        # Format the result like ChromaDB
        return {
            "documents": [[r[0] for r in rows]],
            "metadatas": [[r[1] for r in rows]],
            "distances": [[float(r[2]) for r in rows]]
        }


_collection = None

def get_collection():
    global _collection
    if _collection is None:
        _collection = PgVectorCollection()
    return _collection

def collection_stats() -> dict:
    col = get_collection()
    return {
        "collection": "document_embeddings",
        "total_chunks": col.count(),
        "chroma_server": "pgvector_supabase",
    }
