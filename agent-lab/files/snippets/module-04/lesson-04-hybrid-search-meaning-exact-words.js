// hybrid.js
// No new packages: full-text search is built into Postgres
// Optional speed-up (run once in SQL):
//   CREATE INDEX ON chunks USING gin (to_tsvector('simple', content));
import "dotenv/config";
import pg from "pg";
import { embed } from "./embed.js";

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const toVector = v => "[" + v.join(",") + "]";

const SQL =
  "SELECT doc, content, " +
  "  0.7 * (1 - (embedding <=> $1)) " +                                              // meaning
  "+ 0.3 * ts_rank(to_tsvector('simple', content), plainto_tsquery('simple', $2)) " + // exact words
  "  AS score " +
  "FROM chunks ORDER BY score DESC LIMIT $3";

export async function hybridSearch(question, k = 20) {
  const [q] = await embed([question], "query");
  const { rows } = await db.query(SQL, [toVector(q), question, k]);
  return rows;
}
