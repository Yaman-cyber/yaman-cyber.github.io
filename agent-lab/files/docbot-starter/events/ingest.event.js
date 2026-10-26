const handler = require("../handlers/ingest.handler");
const eventsNames = require("../constants/events.json");

module.exports = function (event) {
  event.on(eventsNames.docs.uploaded, handler.ingestFile);
};
// register it in start/event.js:  require("../events/ingest.event")(eventEmitter);

// ---------- in an upload controller ----------
// eventEmitter.emit(eventsNames.docs.uploaded, { path: req.file.path, name: req.file.originalname });
// res.code = responseCodes.success; res.message = messages[lang].uploadReceived; return next();
