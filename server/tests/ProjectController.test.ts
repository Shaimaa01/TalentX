import request from "supertest";
import { app } from "../src/index";

describe("ProjectController Functional Tests", () => {
  describe("GET /api/projects", () => {
    it("should return 200 and a list of projects", async () => {
      const response = await request(app).get("/api/projects");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/projects/:id", () => {
    it("should return 404 for non-existent project", async () => {
      const response = await request(app).get("/api/projects/non-existent-id");
      expect(response.status).toBe(404);
    });
  });
});
