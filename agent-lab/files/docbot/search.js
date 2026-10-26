// Agent Lab · Module 03 · Lesson 5: Search: find the nearest pieces
// https://yaman-cyber.github.io/agent-lab/m3/#m3-l4

import dotenv from "dotenv";
dotenv.config({ quiet: true });   // [added] files that import search.js get DATABASE_URL; quiet keeps the MCP server's stdout clean
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
