const fs = require("node:fs/promises");
const winston = require("winston");
const { chunk } = require("../helpers/chunk");
const { addChunks } = require("../services/ai/retrieval.service");

async function ingestFile({ path, name }) {
  const pieces = chunk(await fs.readFile(path, "utf8"));
  await addChunks(name, pieces);
  winston.info("Indexed " + name + " (" + pieces.length + " chunks)");
}

module.exports = { ingestFile };
