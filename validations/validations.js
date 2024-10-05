const Joi = require("joi");

const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).required(),
  mobile: Joi.string().min(10).max(10).optional(),
  aadhar: Joi.string().required(),
  pan: Joi.string().required(),
  // contact_no: Joi.number().integer().min(10).max(10).optional,
  role: Joi.string().valid("user", "admin").optional(),
  // password: Joi.string().min(8).required(),
});

module.exports = { userSchema };
