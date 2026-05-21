"""
routers/ingest.py
-----------------
Phase 3: PDF → OCR → Chunk → Embed → ChromaDB

POST /ingest
    Accepts a PDF file upload.
    1. Extracts text (native or OCR fallback via ocr_service)
    2. Splits text into overlapping chunks (chunking_service)
    3. Generates Gemini embeddings for each chunk (embedding_service)
    4. Upserts chunks + embeddings into ChromaDB (vector_store)
    Returns a JSON summary with ingestion stats.

GET /ingest/stats
    Returns the number of chunks currently stored in ChromaDB.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException

from services.ocr_service import extract_text_from_pdf
from services.chunking_service import chunk_text
from services.embedding_service import embed_chunks
from core.vector_store import get_collection, collection_stats

router = APIRouter(tags=["Document Ingestion"])


# ── POST /ingest ──────────────────────────────────────────────────────────────

@router.post("/ingest")
async def ingest_document(file: UploadFile = File(...)):
    """
    Upload a PDF document.  The pipeline:
      PDF → text extraction (OCR if scanned) → chunking → Gemini embeddings → ChromaDB
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # ── 1. Read & OCR ────────────────────────────────────────────────────────
    try:
        content = await file.read()
        extracted_text = extract_text_from_pdf(content)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {e}")

    if not extracted_text:
        raise HTTPException(
            status_code=422,
            detail="Could not extract any text from the provided PDF.",
        )

    # ── 2. Chunk ─────────────────────────────────────────────────────────────
    chunks = chunk_text(text=extracted_text, filename=file.filename)

    if not chunks:
        raise HTTPException(
            status_code=422,
            detail="Document was too short to produce any chunks.",
        )

    # ── 3. Embed ─────────────────────────────────────────────────────────────
    try:
        vectors = embed_chunks(chunks)
    except EnvironmentError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding failed: {e}")

    # ── 4. Upsert into ChromaDB ───────────────────────────────────────────────
    try:
        collection = get_collection()

        # Build stable IDs: <filename>_chunk_<index>  (deduplicated on re-ingest)
        ids = [f"{file.filename}_chunk_{c['metadata']['chunk_index']}" for c in chunks]
        documents = [c["text"] for c in chunks]
        metadatas = [c["metadata"] for c in chunks]

        collection.upsert(
            ids=ids,
            embeddings=vectors,
            documents=documents,
            metadatas=metadatas,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vector store upsert failed: {e}")

    # ── 5. Return summary ─────────────────────────────────────────────────────
    return {
        "status": "success",
        "filename": file.filename,
        "text_length": len(extracted_text),
        "chunks_stored": len(chunks),
        "embedding_dims": len(vectors[0]) if vectors else 0,
        "preview": extracted_text[:300] + "…" if len(extracted_text) > 300 else extracted_text,
    }


# ── GET /ingest/stats ─────────────────────────────────────────────────────────

@router.get("/ingest/stats")
async def get_ingest_stats():
    """
    Returns how many text chunks are currently indexed in ChromaDB.
    """
    try:
        return collection_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
