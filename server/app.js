// app.js
// Express application setup — middleware, routes, swagger

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// ──────────────────────────────────────────
// Security Middleware
// ──────────────────────────────────────────

// Set various HTTP security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Allow requests from the React frontend
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests. Please try again later." },
});
app.use("/api", limiter);

// ──────────────────────────────────────────
// Body Parsing & Logging
// ──────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// ──────────────────────────────────────────
// API Routes
// ──────────────────────────────────────────
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/tasks", require("./routes/task.routes"));

// ──────────────────────────────────────────
// Swagger UI Docs
// ──────────────────────────────────────────
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "TaskFlow API Docs",
}));

// Health check
app.get("/", (req, res) => res.json({ message: "TaskFlow API is running 🚀", docs: "/api/docs" }));

// ──────────────────────────────────────────
// Error Handling (must be LAST)
// ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
