"""
services/chunking_service.py
-----------------------------
Splits raw extracted text into overlapping chunks that are small enough
for the Gemini embedding model (max ~2 048 tokens) while still carrying
enough context for high-quality retrieval.

Strategy
--------
- RecursiveCharacterTextSplitter from LangChain
  → tries to split on paragraphs, then sentences, then words, then chars
- chunk_size   = 800 chars  (~200 tokens — a solid retrieval unit)
- chunk_overlap = 150 chars  (~38 tokens — keeps context across boundaries)
- Metadata attached to every chunk: filename, chunk_index, total_chunks
"""

from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_text(
    text: str,
    filename: str,
    chunk_size: int = 800,
    chunk_overlap: int = 150,
) -> list[dict]:
    """
    Split *text* into overlapping chunks and attach metadata.

    Returns
    -------
    list of dict, each containing:
        "text"     – the chunk content
        "metadata" – {"filename": ..., "chunk_index": ..., "total_chunks": ...}
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    raw_chunks: list[str] = splitter.split_text(text)
    total = len(raw_chunks)

    chunks = [
        {
            "text": chunk.strip(),
            "metadata": {
                "filename": filename,
                "chunk_index": idx,
                "total_chunks": total,
            },
        }
        for idx, chunk in enumerate(raw_chunks)
        if chunk.strip()  # skip any empty chunks
    ]

    return chunks
