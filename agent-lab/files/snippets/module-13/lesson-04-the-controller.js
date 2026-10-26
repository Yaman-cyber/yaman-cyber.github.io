// controllers/api/v1/docbot.controller.js
const crypto = require("node:crypto");
const validate = require("../../../validators/docbot");
const docbot = require("../../../services/agent/docbot.service");
const messages = require("../../../constants/messages.json");
const responseCodes = require("../../../constants/responseCodes.json");

exports.ask = async (req, res, next) => {
  const { lang, body, user } = req;

  const { error, value } = validate.askValid(body);
  if (error) {
    res.code = responseCodes.badRequest;
    res.message = error.details[0].message;
    return next();
  }

  res.data = await docbot.ask({
    question: value.question,
    userId: user._id,                                  // trusted: from the JWT, not the body
    threadId: value.threadId || crypto.randomUUID(),
  });
  res.code = responseCodes.success;
  res.message = messages[lang].docbotAnswered;
  return next();
};

exports.decide = async (req, res, next) => {
  const { lang, body } = req;

  const { error, value } = validate.decideValid(body);
  if (error) {
    res.code = responseCodes.badRequest;
    res.message = error.details[0].message;
    return next();
  }

  res.data = await docbot.decide(value);
  res.code = responseCodes.success;
  res.message = messages[lang].actionDecided;
  return next();
};
