// config/db.js
// Handles MongoDB connection using Mongoose

const mongoose = require("mongoose");

/**
 * Connect to MongoDB database
 * Uses the MONGO_URI from environment variables
 * Exits process if connection fails (fail-fast pattern)
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
