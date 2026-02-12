import request from "supertest";
import { app } from "../src/index";

describe("Remaining Controllers Functional Tests (Smoke Tests)", () => {
  
  describe("AuditLogController", () => {
    it("should return 401 for audit logs when not authenticated", async () => {
      const response = await request(app).get("/api/admin/audit-logs");
      expect(response.status).toBe(401);
    });
  });

  describe("CMSController", () => {
    it("should return 200 for public FAQs", async () => {
      const response = await request(app).get("/api/cms/faqs");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("ContractController", () => {
    it("should return 401 for contracts when not authenticated", async () => {
      const response = await request(app).get("/api/contracts");
      expect(response.status).toBe(401);
    });
  });

  describe("DisputeController", () => {
    it("should return 401 for disputes when not authenticated", async () => {
      const response = await request(app).get("/api/disputes");
      expect(response.status).toBe(401);
    });
  });

  describe("HireRequestController", () => {
    it("should return 401 for hire requests when not authenticated", async () => {
      const response = await request(app).get("/api/hire-requests");
      expect(response.status).toBe(401);
    });
  });

  describe("MessageController", () => {
    it("should return 401 for messages when not authenticated", async () => {
      const response = await request(app).get("/api/messages");
      expect(response.status).toBe(401);
    });
  });

  describe("NotificationController", () => {
    it("should return 401 for notifications when not authenticated", async () => {
      const response = await request(app).get("/api/notifications");
      expect(response.status).toBe(401);
    });
  });

  describe("SystemSettingController", () => {
    it("should return 401 for settings when not authenticated", async () => {
      const response = await request(app).get("/api/settings");
      expect(response.status).toBe(401);
    });
  });

  describe("TaskController", () => {
    it("should return 401 for tasks when not authenticated", async () => {
      const response = await request(app).get("/api/tasks");
      expect(response.status).toBe(401);
    });
  });

  describe("TeamController", () => {
    it("should return 401 for teams when not authenticated", async () => {
      const response = await request(app).get("/api/teams");
      expect(response.status).toBe(401);
    });
  });

  describe("WorkVerificationController", () => {
    it("should return 401 for work verification when not authenticated", async () => {
      const response = await request(app).get("/api/work-verification/time-logs/project/1");
      expect(response.status).toBe(401);
    });
  });

});
