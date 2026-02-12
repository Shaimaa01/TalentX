import request from "supertest";
import { app } from "../src/index";

describe("TalentController Functional Tests", () => {
  describe("GET /api/talents", () => {
    it("should return 200 and a list of talents", async () => {
      const response = await request(app).get("/api/talents");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/talents/:id", () => {
    it("should return 404 for non-existent talent", async () => {
      const response = await request(app).get("/api/talents/non-existent-id");
      expect(response.status).toBe(404);
    });
  });
});
