// services/ai/embedding.service.js + retrieval.service.js
// ---------- services/ai/embedding.service.js ----------
const config = require("config");

async function voyage(path, body) {
  const res = await fetch("https://api.voyageai.com/v1" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + config.get("voyageKey") },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Voyage " + path + " failed with status " + res.status);
  return res.json();
}

async function embed(texts, inputType) {
  const json = await voyage("/embeddings", { input: texts, model: "voyage-3.5", input_type: inputType });
  return json.data.map(d => d.embedding);
}

async function rerank(query, documents, topK = 5) {
  const json = await voyage("/rerank", { query, documents, model: "rerank-2.5", top_k: topK });
  return json.data;                       // [{ index, relevance_score }]
}

module.exports = { embed, rerank };

// ---------- services/ai/retrieval.service.js ----------
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
