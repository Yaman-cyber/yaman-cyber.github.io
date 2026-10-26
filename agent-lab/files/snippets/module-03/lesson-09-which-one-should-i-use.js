// store.js: swap databases without touching DocBot
// Each store exposes the same two functions: add() and search()
import * as pgStore from "./stores/pgvector.js";
import * as chromaStore from "./stores/chroma.js";
import * as qdrantStore from "./stores/qdrant.js";

const stores = { pg: pgStore, chroma: chromaStore, qdrant: qdrantStore };
export const store = stores[process.env.VECTOR_DB || "pg"];

// DocBot only ever calls:
//   await store.add(chunks)
//   await store.search(question, 5)
