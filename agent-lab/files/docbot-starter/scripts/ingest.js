require("dotenv").config({ path: ".env.development" });
const fs = require("node:fs/promises");
const { chunk } = require("../helpers/chunk");
const { addChunks } = require("../services/ai/retrieval.service");
const { vectorDb } = require("../services/ai/clients");

(async () => {
  for (const file of await fs.readdir("docs")) {
    const pieces = chunk(await fs.readFile("docs/" + file, "utf8"));
    await addChunks(file, pieces);
    console.log(file, "→", pieces.length, "chunks");
  }
  await vectorDb.end();
})();
