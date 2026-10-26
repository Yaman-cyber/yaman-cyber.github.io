// events, handlers and crons
// ---------- constants/events.json ----------
// { "email": { ... }, "docs": { "uploaded": "docs-uploaded" } }

// ---------- handlers/ingest.handler.js ----------
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

// ---------- events/ingest.event.js ----------
const handler = require("../handlers/ingest.handler");
const eventsNames = require("../constants/events.json");

module.exports = function (event) {
  event.on(eventsNames.docs.uploaded, handler.ingestFile);
};
// register it in start/event.js:  require("../events/ingest.event")(eventEmitter);

// ---------- in an upload controller ----------
// eventEmitter.emit(eventsNames.docs.uploaded, { path: req.file.path, name: req.file.originalname });
// res.code = responseCodes.success; res.message = messages[lang].uploadReceived; return next();

// ---------- crons/reindex.cron.js ----------
const fs = require("node:fs/promises");
const { ingestFile } = require("../handlers/ingest.handler");

module.exports = async function reindexAll() {
  for (const name of await fs.readdir("docs")) await ingestFile({ path: "docs/" + name, name });
};
// schedule it in start/cron.js:  schedule.scheduleJob("0 3 * * *", require("../crons/reindex.cron"));
