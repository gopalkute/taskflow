// tests/auth.test.js
// Jest + Supertest tests for Authentication API

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");

// Test user credentials
const testUser = {
  name: "Test User",
  email: "testauth@example.com",
  password: "password123",
};

// Connect to test DB before all tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskflow_test");
});

// Clean up test user after all tests
afterAll(async () => {
  await User.deleteMany({ email: testUser.email });
  await mongoose.connection.close();
});

// ──────────────────────────────────────────
// Registration Tests
// ──────────────────────────────────────────
describe("POST /api/auth/register", () => {
  it("should register a new user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("should reject duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should reject missing name", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "a@b.com", password: "pass123" });
    expect(res.statusCode).toBe(400);
  });

  it("should reject invalid email", async () => {
    const res = await request(app).post("/api/auth/register").send({ name: "Test", email: "notanemail", password: "pass123" });
    expect(res.statusCode).toBe(400);
  });

  it("should reject short password", async () => {
    const res = await request(app).post("/api/auth/register").send({ name: "Test", email: "x@y.com", password: "123" });
    expect(res.statusCode).toBe(400);
  });
});

// ──────────────────────────────────────────
// Login Tests
// ──────────────────────────────────────────
describe("POST /api/auth/login", () => {
  it("should login with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it("should reject wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: testUser.email, password: "wrongpass" });
    expect(res.statusCode).toBe(401);
  });

  it("should reject non-existent email", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "nobody@test.com", password: "pass123" });
    expect(res.statusCode).toBe(401);
  });
});

// ──────────────────────────────────────────
// Profile Tests
// ──────────────────────────────────────────
describe("GET /api/auth/profile", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({ email: testUser.email, password: testUser.password });
    token = res.body.token;
  });

  it("should return profile for authenticated user", async () => {
    const res = await request(app).get("/api/auth/profile").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("should reject request without token", async () => {
    const res = await request(app).get("/api/auth/profile");
    expect(res.statusCode).toBe(401);
  });

  it("should reject invalid token", async () => {
    const res = await request(app).get("/api/auth/profile").set("Authorization", "Bearer invalidtoken");
    expect(res.statusCode).toBe(401);
  });
});
