// validators/docbot/
// ---------- validators/docbot/ask-valid.js ----------
const Joi = require("joi");

module.exports = function (data) {
  const schema = Joi.object({
    question: Joi.string().trim().min(2).max(2000).required(),
    threadId: Joi.string().guid().optional(),   // continue an earlier conversation
  });
  return schema.validate(data);
};

// ---------- validators/docbot/decide-valid.js ----------
const Joi = require("joi");

module.exports = function (data) {
  const schema = Joi.object({
    threadId: Joi.string().guid().required(),
    approved: Joi.boolean().required(),
  });
  return schema.validate(data);
};

// ---------- validators/docbot/index.js ----------
module.exports = {
  askValid: require("./ask-valid"),
  decideValid: require("./decide-valid"),
};
