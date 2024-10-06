// utils/customValidators.js
const Joi = require("joi");

// Extend Joi for custom PAN validation
const extendedJoi = Joi.extend((joi) => ({
  type: "pan",
  base: joi.string(),
  messages: {
    "pan.base": '"{{#label}}" must be a valid PAN number.',
    "pan.format": '"{{#label}}" must be in the format ABCDE1234F.',
  },
  rules: {
    format: {
      validate(value, helpers) {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(value)) {
          return helpers.error("pan.format");
        }
        return value; // Return the validated value if successful
      },
    },
  },
}));

// Extend Joi for custom Aadhaar validation
// const customJoi = extendedJoi.extend((joi) => ({
//   type: "aadhaar",
//   base: joi.string(),
//   messages: {
//     "aadhaar.base": '"{{#label}}" must be a valid Aadhaar number.',
//     "aadhaar.length": '"{{#label}}" must be exactly 12 digits long.',
//     "aadhaar.numeric": '"{{#label}}" must contain only numeric characters.',
//   },
//   rules: {
//     length: {
//       validate(value, helpers) {
//         if (value.length !== 12) {
//           return helpers.error("aadhaar.length");
//         }
//         return value;
//       },
//     },
//     numeric: {
//       validate(value, helpers) {
//         const aadhaarRegex = /^[0-9]{12}$/;
//         if (!aadhaarRegex.test(value)) {
//           return helpers.error("aadhaar.numeric");
//         }
//         return value; // Return the validated value if successful
//       },
//     },
//   },
// }));

module.exports = extendedJoi;
