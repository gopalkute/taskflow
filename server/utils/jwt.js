// utils/jwt.js
// Utility functions for generating JWT tokens

const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT token
 * @param {string} id - MongoDB user ID to embed in the token payload
 * @returns {string} - Signed JWT token string
 */
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload: store user ID
    process.env.JWT_SECRET, // Secret key from environment
    { expiresIn: process.env.JWT_EXPIRE || "7d" } // Expiry time
  );
};

module.exports = { generateToken };
