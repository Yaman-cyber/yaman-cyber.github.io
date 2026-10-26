// Agent Lab · Module 03 · Lesson 9: the pgvector store that store.js picks with VECTOR_DB=pg
// Written for the download from Lessons 4–5 (schema.sql + search.js). Same two functions as every store:
//   add([{ doc, content }])   and   search(question, k) → [{ doc, content, score }], best first
import "dotenv/config";
import pg from "pg";
import { embed } from "../embed.js";

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const toVector = v => "[" + v.join(",") + "]";

export async function add(chunks) {
  const vectors = await embed(chunks.map(c => c.content), "document");
  for (let i = 0; i < chunks.length; i++) {
    await db.query("INSERT INTO chunks (doc, content, embedding) VALUES ($1, $2, $3)",
      [chunks[i].doc, chunks[i].content, toVector(vectors[i])]);
  }
}

export async function search(question, k = 5) {
  const [q] = await embed([question], "query");
  const { rows } = await db.query(
    "SELECT doc, content, 1 - (embedding <=> $1) AS score FROM chunks ORDER BY embedding <=> $1 LIMIT $2",
    [toVector(q), k],
  );
  return rows;
}
