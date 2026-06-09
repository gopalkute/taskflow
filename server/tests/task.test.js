// tests/task.test.js
// Jest + Supertest tests for Task API

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const Task = require("../models/Task");

let token;
let taskId;

const testUser = { name: "Task Tester", email: "tasktest@example.com", password: "password123" };

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskflow_test");
  // Register and login to get token
  await request(app).post("/api/auth/register").send(testUser);
  const res = await request(app).post("/api/auth/login").send({ email: testUser.email, password: testUser.password });
  token = res.body.token;
});

afterAll(async () => {
  await User.deleteMany({ email: testUser.email });
  await Task.deleteMany({ title: /Test Task/i });
  await mongoose.connection.close();
});

// ──────────────────────────────────────────
// Create Task
// ──────────────────────────────────────────
describe("POST /api/tasks", () => {
  it("should create a task successfully", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Task One", description: "A test description", priority: "high" });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Test Task One");
    taskId = res.body.data._id; // Save for later tests
  });

  it("should reject task with no title", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "No title here" });
    expect(res.statusCode).toBe(400);
  });

  it("should reject unauthenticated request", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "Unauthorized Task" });
    expect(res.statusCode).toBe(401);
  });
});

// ──────────────────────────────────────────
// Get Tasks
// ──────────────────────────────────────────
describe("GET /api/tasks", () => {
  it("should return list of tasks", async () => {
    const res = await request(app).get("/api/tasks").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should filter by status=pending", async () => {
    const res = await request(app).get("/api/tasks?status=pending").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    res.body.data.forEach((t) => expect(t.status).toBe("pending"));
  });

  it("should support search query", async () => {
    const res = await request(app).get("/api/tasks?search=Test Task One").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

// ──────────────────────────────────────────
// Get Single Task
// ──────────────────────────────────────────
describe("GET /api/tasks/:id", () => {
  it("should return task by ID", async () => {
    const res = await request(app).get(`/api/tasks/${taskId}`).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(taskId);
  });

  it("should return 404 for non-existent task", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/tasks/${fakeId}`).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});

// ──────────────────────────────────────────
// Update Task
// ──────────────────────────────────────────
describe("PUT /api/tasks/:id", () => {
  it("should update a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Task Updated", priority: "low" });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Test Task Updated");
  });
});

// ──────────────────────────────────────────
// Toggle Status
// ──────────────────────────────────────────
describe("PATCH /api/tasks/:id/status", () => {
  it("should toggle status to completed", async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "completed" });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe("completed");
  });
});

// ──────────────────────────────────────────
// Stats
// ──────────────────────────────────────────
describe("GET /api/tasks/stats", () => {
  it("should return dashboard stats", async () => {
    const res = await request(app).get("/api/tasks/stats").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("total");
    expect(res.body.data).toHaveProperty("completed");
    expect(res.body.data).toHaveProperty("pending");
  });
});

// ──────────────────────────────────────────
// Delete Task
// ──────────────────────────────────────────
describe("DELETE /api/tasks/:id", () => {
  it("should delete a task", async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 404 after deletion", async () => {
    const res = await request(app).get(`/api/tasks/${taskId}`).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});
