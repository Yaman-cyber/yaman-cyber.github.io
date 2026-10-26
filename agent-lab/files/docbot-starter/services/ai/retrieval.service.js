const { vectorDb } = require("./clients");
const { embed, rerank } = require("./embedding.service");

const toVector = v => "[" + v.join(",") + "]";
const HYBRID_SQL =
  "SELECT doc, content, 0.7 * (1 - (embedding <=> $1)) " +
  "+ 0.3 * ts_rank(to_tsvector('simple', content), plainto_tsquery('simple', $2)) AS score " +
  "FROM chunks ORDER BY score DESC LIMIT $3";

async function retrieve(question, k = 5) {
  const [q] = await embed([question], "query");
  const { rows } = await vectorDb.query(HYBRID_SQL, [toVector(q), question, 20]);
  if (rows.length === 0) return [];
  const ranked = await rerank(question, rows.map(r => r.content), k);
  return ranked.map(r => rows[r.index]);
}

async function addChunks(doc, chunks) {
  const vectors = await embed(chunks, "document");
  await vectorDb.query("DELETE FROM chunks WHERE doc = $1", [doc]);   // re-indexing replaces the doc's old chunks
  for (let i = 0; i < chunks.length; i++) {
    await vectorDb.query("INSERT INTO chunks (doc, content, embedding) VALUES ($1, $2, $3)",
      [doc, chunks[i], toVector(vectors[i])]);
  }
}

module.exports = { retrieve, addChunks };
