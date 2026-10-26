// search.js
import pg from "pg";
import { embed } from "./embed.js";

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const toVector = v => "[" + v.join(",") + "]";

export async function search(question, k = 5) {
  const [q] = await embed([question], "query");
  const { rows } = await db.query(
    "SELECT doc, content, 1 - (embedding <=> $1) AS score FROM chunks ORDER BY embedding <=> $1 LIMIT $2",
    [toVector(q), k],
  );
  return rows;
}
