import request from "supertest";
import { app } from "../src/index";

describe("AuthController Functional Tests", () => {
  describe("POST /api/auth/login", () => {
    it("should return 401 for invalid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "wrongpassword",
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    it("should return 400 for missing fields", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Validation Error");
    });
  });

  describe("POST /api/auth/register", () => {
    it("should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "invalid-email",
          password: "password123",
          firstName: "John",
          lastName: "Doe",
          role: "talent"
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Validation Error");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return 401 when not authenticated", async () => {
      const response = await request(app).get("/api/auth/me");
      expect(response.status).toBe(401);
    });
  });
});
