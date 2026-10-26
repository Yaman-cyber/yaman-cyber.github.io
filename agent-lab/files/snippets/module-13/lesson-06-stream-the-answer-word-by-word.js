// add to docbot.controller.js
const config = require("config");
const { anthropic } = require("../../../services/ai/clients");
const { retrieve } = require("../../../services/ai/retrieval.service");
const prompts = require("../../../constants/prompts");

exports.askStream = async (req, res) => {
  const { error, value } = validate.askValid(req.body);
  if (error) return res.status(responseCodes.badRequest).send({ success: false, message: error.details[0].message });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.flushHeaders();                                   // open the stream now

  const pieces = await retrieve(value.question, 5);
  const sources = pieces.map((p, i) => "[" + (i + 1) + "] " + p.content).join("\n\n");

  const stream = anthropic.messages.stream({
    model: config.get("aiModel"),
    max_tokens: 800,
    system: prompts.docbot,
    messages: [{ role: "user", content: sources + "\n\nQuestion: " + value.question }],
  });

  stream.on("text", (text) => res.write("data: " + JSON.stringify({ text }) + "\n\n"));
  await stream.finalMessage();                          // wait until Claude is done

  res.write("data: [DONE]\n\n");
  res.end();
};
