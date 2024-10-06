// schemas/userSchema.js
const customJoi = require("../validations/customValidators");

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

module.exports = userSchema;
