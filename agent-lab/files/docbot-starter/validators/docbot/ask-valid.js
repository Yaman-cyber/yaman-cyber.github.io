const Joi = require("joi");

module.exports = function (data) {
  const schema = Joi.object({
    question: Joi.string().trim().min(2).max(2000).required(),
    threadId: Joi.string().guid().optional(),   // continue an earlier conversation
  });
  return schema.validate(data);
};
