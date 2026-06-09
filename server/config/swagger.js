// config/swagger.js
// Swagger/OpenAPI documentation configuration

const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskFlow API",
      version: "1.0.0",
      description:
        "A complete Task Management REST API built with Node.js, Express, and MongoDB",
      contact: {
        name: "TaskFlow Support",
        email: "support@taskflow.dev",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        // Bearer token authentication
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // User schema definition
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64f1b2c3d4e5f6a7b8c9d0e1" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        // Task schema definition
        Task: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64f1b2c3d4e5f6a7b8c9d0e2" },
            title: { type: "string", example: "Build REST API" },
            description: {
              type: "string",
              example: "Create all endpoints for the task manager",
            },
            status: {
              type: "string",
              enum: ["pending", "completed"],
              example: "pending",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "high",
            },
            dueDate: { type: "string", format: "date-time" },
            userId: { type: "string", example: "64f1b2c3d4e5f6a7b8c9d0e1" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        // Error response schema
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message here" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Path to API route files containing JSDoc comments
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
