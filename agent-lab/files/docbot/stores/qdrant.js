// Agent Lab · Module 03 · Lesson 9: the Qdrant store that store.js picks with VECTOR_DB=qdrant
// Written for the download from Lesson 8 (qdrant.js). Run Qdrant first: docker compose up -d qdrant
import "dotenv/config";
import crypto from "node:crypto";
import { QdrantClient } from "@qdrant/js-client-rest";
import { embed } from "../embed.js";

const qdrant = new QdrantClient({ url: "http://localhost:6333" });
const NAME = "docbot-store";

async function ensureCollection() {
  const { exists } = await qdrant.collectionExists(NAME);
  if (!exists) await qdrant.createCollection(NAME, { vectors: { size: 1024, distance: "Cosine" } });
}

export async function add(chunks) {
  await ensureCollection();
  const vectors = await embed(chunks.map(c => c.content), "document");
  await qdrant.upsert(NAME, {
    points: chunks.map((c, i) => ({ id: crypto.randomUUID(), vector: vectors[i], payload: { doc: c.doc, content: c.content } })),
  });
}

export async function search(question, k = 5) {
  await ensureCollection();
  const [q] = await embed([question], "query");
  const { points } = await qdrant.query(NAME, { query: q, limit: k, with_payload: true });
  return points.map(h => ({ doc: h.payload.doc, content: h.payload.content, score: h.score }));
}
