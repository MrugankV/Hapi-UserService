// schemas/userSchema.js
const customJoi = require("../validations/customValidators");
const Joi = require("joi");
const userSchema = customJoi.object({
  firstName: customJoi.string().min(1).max(50).required(),
  lastName: customJoi.string().min(1).max(50).required(),
  email: customJoi.string().email().required(),
  password: customJoi.string().max(25).required(),
  aadhar: customJoi
    .string()
    .length(12)
    .pattern(/^[0-9]+$/)
    .required(),
  pan: customJoi.pan().format().required(),
  mobile: customJoi
    .string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .message("Mobile should be a 10-digit numeric value."),
  role: customJoi.string().valid("admin", "user").required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email() // Validates that the input is a valid email address
    .required() // This field is required
    .messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8) // Minimum length of 8 characters
    .required() // This field is required
    .messages({
      "string.base": "Password must be a string",
      "string.min": "Password must be at least 8 characters long",
      "any.required": "Password is required",
    }),
});

module.exports = { userSchema, loginSchema };
