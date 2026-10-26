// Agent Lab · Module 03 · Lesson 9: the ChromaDB store that store.js picks with VECTOR_DB=chroma
// Written for the download from Lesson 7 (chroma.js). Run Chroma first: docker compose up -d chroma
import "dotenv/config";
import crypto from "node:crypto";
import { ChromaClient } from "chromadb";
import { embed } from "../embed.js";

const chroma = new ChromaClient();   // http://localhost:8000
const collection = () => chroma.getOrCreateCollection({ name: "docbot-store", embeddingFunction: null, configuration: { hnsw: { space: "cosine" } } });

export async function add(chunks) {
  const docs = await collection();
  await docs.add({
    ids: chunks.map(() => crypto.randomUUID()),
    embeddings: await embed(chunks.map(c => c.content), "document"),
    documents: chunks.map(c => c.content),
    metadatas: chunks.map(c => ({ doc: c.doc })),
  });
}

export async function search(question, k = 5) {
  const docs = await collection();
  const [q] = await embed([question], "query");
  const res = await docs.query({ queryEmbeddings: [q], nResults: k });
  return res.documents[0].map((content, i) => ({ doc: res.metadatas[0][i].doc, content, score: 1 - res.distances[0][i] }));
}
