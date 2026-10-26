const Joi = require("joi");

module.exports = function (data) {
  const schema = Joi.object({
    threadId: Joi.string().guid().required(),
    approved: Joi.boolean().required(),
  });
  return schema.validate(data);
};
