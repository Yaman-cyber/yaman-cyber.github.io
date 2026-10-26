// schema.sql
-- run Postgres with pgvector: docker run -e POSTGRES_PASSWORD=pw -p 5432:5432 pgvector/pgvector:pg17
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chunks (
  id        BIGSERIAL PRIMARY KEY,
  doc       TEXT NOT NULL,
  content   TEXT NOT NULL,
  embedding VECTOR(1024)
);

CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);
