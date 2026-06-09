// middleware/auth.js
// JWT authentication middleware for protecting routes

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect middleware
 * Verifies the JWT token from the Authorization header
 * Attaches the authenticated user to req.user
 * Use this middleware on any route that requires login
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];
    }

    // No token found — reject request
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided. Please log in.",
      });
    }

    // Verify the token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID stored in token payload
    // We use .select('+password') only when needed — not here
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is valid but user no longer exists.",
      });
    }

    // Attach user object to request for downstream use
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication error.",
    });
  }
};

module.exports = { protect };
