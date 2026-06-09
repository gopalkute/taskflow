// middleware/validate.js
// Middleware to check express-validator results and return errors

const { validationResult } = require("express-validator");

/**
 * Validate middleware
 * Reads validation errors from express-validator
 * Returns 400 with all validation errors if any exist
 * Call this after your validator arrays in routes
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = { validate };
