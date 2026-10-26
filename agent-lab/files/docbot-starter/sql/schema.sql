-- Run once against the pgvector database (Module 03)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS chunks (
  id        BIGSERIAL PRIMARY KEY,
  doc       TEXT NOT NULL,
  content   TEXT NOT NULL,
  embedding VECTOR(1024)
);

CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS chunks_text_idx ON chunks USING gin (to_tsvector('simple', content));
