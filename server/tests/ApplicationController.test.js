import request from "supertest";
import { app } from "../src/index";
import { describe } from "zod/v4/core";

describe("ApplicationController Functional Tests", () => {
  describe("POST /api/applications", () => {
    it("should return 400 for invalid application data", async () => {
      const response = await request(app)
        .post("/api/applications")
        .send({
          email: "invalid-email",
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Validation Error");
    });
  });

  describe("GET /api/applications", () => {
    it("should return 200 and a list of applications (even if empty)", async () => {
      const response = await request(app).get("/api/applications");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/settings/getSheetUrl", () => {
    it("should show sheet url or 404", async () => {
        const response = await request(app).get("/api/applications/sheet-url");
        expect([200, 404]).toContain(response.status);
    });
  });
});
