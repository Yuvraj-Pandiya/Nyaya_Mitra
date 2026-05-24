-- Create document_embeddings table for pgvector RAG pipeline
CREATE TABLE IF NOT EXISTS document_embeddings (
    id          VARCHAR(255)    PRIMARY KEY,
    embedding   vector(768)     NOT NULL,
    document    TEXT            NOT NULL,
    metadata    JSONB           NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Create an HNSW index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS idx_document_embeddings_cosine 
ON document_embeddings 
USING hnsw (embedding vector_cosine_ops);
