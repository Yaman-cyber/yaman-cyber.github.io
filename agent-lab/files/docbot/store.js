// Agent Lab · Module 03 · Lesson 9: Which one should I use?
// https://yaman-cyber.github.io/agent-lab/m3/#m3-l8

// Each store exposes the same two functions: add() and search()
import * as pgStore from "./stores/pgvector.js";
import * as chromaStore from "./stores/chroma.js";
import * as qdrantStore from "./stores/qdrant.js";

const stores = { pg: pgStore, chroma: chromaStore, qdrant: qdrantStore };
export const store = stores[process.env.VECTOR_DB || "pg"];

// DocBot only ever calls:
//   await store.add(chunks)
//   await store.search(question, 5)

// [added] try it: VECTOR_DB=qdrant node store.js "how do I get my money back"   (index first with ingest-store.js)
if (/[\\/]store\.js$/.test(process.argv[1])) { console.log(await store.search(process.argv[2] || "how do I get my money back", 5)); process.exit(0); }
