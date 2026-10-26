// rerank.js
// No new packages: fetch is built into Node 18+
import "dotenv/config";
import { hybridSearch } from "./hybrid.js";

export async function rerank(question, pieces, topK = 5) {
  const res = await fetch("https://api.voyageai.com/v1/rerank", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + process.env.VOYAGE_API_KEY },
    body: JSON.stringify({ query: question, documents: pieces.map(p => p.content), model: "rerank-2.5", top_k: topK }),
  });
  const json = await res.json();
  return json.data.map(r => pieces[r.index]);   // best first
}

// The full retrieval step DocBot now uses: 20 candidates → best 5
export async function retrieve(question) {
  const candidates = await hybridSearch(question, 20);
  return rerank(question, candidates, 5);
}
