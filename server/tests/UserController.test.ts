import request from "supertest";
import { app } from "../src/index";

describe("UserController Functional Tests", () => {
  describe("GET /api/users", () => {
    it("should return 401 when not authenticated", async () => {
      const response = await request(app).get("/api/users");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/users/profile", () => {
      it("should return 401 when not authenticated", async () => {
        const response = await request(app).get("/api/users/profile");
        expect(response.status).toBe(401);
      });
  });
});
