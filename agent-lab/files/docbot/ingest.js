// Agent Lab · Module 04 · Lesson 2: Chunking: cut docs into pieces
// https://yaman-cyber.github.io/agent-lab/m4/#m4-l1

import "dotenv/config";
import fs from "node:fs/promises";           // built into Node, no install
import pg from "pg";
import { chunk } from "./chunk.js";
import { embed } from "./embed.js";           // from Module 03

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const toVector = v => "[" + v.join(",") + "]";

for (const file of await fs.readdir("docs")) {
  const text = await fs.readFile("docs/" + file, "utf8");
  const pieces = chunk(text);
  const vectors = await embed(pieces, "document");

  await db.query("DELETE FROM chunks WHERE doc = $1", [file]);   // re-running replaces this file's chunks
  for (let i = 0; i < pieces.length; i++) {
    await db.query(
      "INSERT INTO chunks (doc, content, embedding) VALUES ($1, $2, $3)",
      [file, pieces[i], toVector(vectors[i])],
    );
  }
  console.log(file, "→", pieces.length, "chunks");
}

await db.end();   // close the connection so the script exits
