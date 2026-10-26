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
