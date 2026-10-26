const fs = require("node:fs/promises");
const { ingestFile } = require("../handlers/ingest.handler");

module.exports = async function reindexAll() {
  for (const name of await fs.readdir("docs")) await ingestFile({ path: "docs/" + name, name });
};
// schedule it in start/cron.js:  schedule.scheduleJob("0 3 * * *", require("../crons/reindex.cron"));
