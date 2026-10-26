// chroma.js
// run Chroma locally: docker run -p 8000:8000 chromadb/chroma
// install: npm install chromadb
import { ChromaClient } from "chromadb";
import { embed } from "./embed.js";

const chroma = new ChromaClient();                      // connects to localhost:8000
const docs = await chroma.getOrCreateCollection({ name: "docbot", embeddingFunction: null }); // we bring our own vectors

// 1) store chunks
const texts = ["Refunds are issued within 30 days.", "يتم الاسترداد خلال 30 يوماً"];
await docs.add({
  ids: ["refunds-1", "refunds-ar-1"],
  embeddings: await embed(texts, "document"),
  documents: texts,
  metadatas: [{ doc: "refunds.md", lang: "en" }, { doc: "refunds-ar.md", lang: "ar" }],
});

// 2) search
const [q] = await embed(["how do I get my money back"], "query");
const results = await docs.query({
  queryEmbeddings: [q],
  nResults: 5,
  where: { lang: "en" },                                // optional filter on metadata
});

console.log(results.documents[0], results.distances[0]);
