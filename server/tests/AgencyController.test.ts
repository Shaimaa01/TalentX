import request from "supertest";
import { app } from "../src/index";

describe("AgencyController Functional Tests", () => {
  describe("GET /api/agencies", () => {
    it("should return 200 and a list of agencies", async () => {
      const response = await request(app).get("/api/agencies");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/agencies/:id", () => {
    it("should return 404 for non-existent agency", async () => {
      const response = await request(app).get("/api/agencies/non-existent-id");
      expect(response.status).toBe(404);
    });
  });
});
