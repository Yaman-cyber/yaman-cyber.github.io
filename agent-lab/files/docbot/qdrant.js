// Agent Lab · Module 03 · Lesson 8: Same job, another tool: Qdrant
// https://yaman-cyber.github.io/agent-lab/m3/#m3-l7

import "dotenv/config";   // [added] VOYAGE_API_KEY for embed()
// run Qdrant locally: docker run -p 6333:6333 qdrant/qdrant
// install: npm install @qdrant/js-client-rest
import { QdrantClient } from "@qdrant/js-client-rest";
import { embed } from "./embed.js";

const qdrant = new QdrantClient({ url: "http://localhost:6333" });

// 1) create the collection once: vector size must match your embedding model
const { exists } = await qdrant.collectionExists("docbot");
if (!exists) {
  await qdrant.createCollection("docbot", {
    vectors: { size: 1024, distance: "Cosine" },
  });
}

// 2) store chunks as points
const texts = ["Refunds are issued within 30 days.", "يتم الاسترداد خلال 30 يوماً"];
const vectors = await embed(texts, "document");
await qdrant.upsert("docbot", {
  points: [
    { id: 1, vector: vectors[0], payload: { doc: "refunds.md", lang: "en", content: texts[0] } },
    { id: 2, vector: vectors[1], payload: { doc: "refunds-ar.md", lang: "ar", content: texts[1] } },
  ],
});

// 3) search, with a filter
const [q] = await embed(["متى يتم استرداد المبلغ"], "query");
const { points } = await qdrant.query("docbot", {
  query: q,
  limit: 5,
  filter: { must: [{ key: "lang", match: { value: "ar" } }] },
  with_payload: true,
});

console.log(points.map(h => [h.score, h.payload.doc]));
