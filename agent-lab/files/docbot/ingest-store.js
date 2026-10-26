// Agent Lab · Module 03 · Lesson 9: index docs/ into whichever store VECTOR_DB picks (pg, chroma or qdrant)
// Written for the download. Uses chunk() from Module 04.
//   VECTOR_DB=qdrant node ingest-store.js     then     VECTOR_DB=qdrant node store.js "money back"
import fs from "node:fs/promises";
import { chunk } from "./chunk.js";
import { store } from "./store.js";

for (const file of await fs.readdir("docs")) {
  const pieces = chunk(await fs.readFile("docs/" + file, "utf8"));
  await store.add(pieces.map(content => ({ doc: file, content })));
  console.log(file, "→", pieces.length, "chunks");
}
process.exit(0);
