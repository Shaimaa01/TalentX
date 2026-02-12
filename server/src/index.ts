import "./tracing";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import cookieParser from "cookie-parser";

import * as Router from "./interface/routes/indexRouter";

import { maintenanceMiddleware } from "./interface/middleware/MaintenanceMiddleware";

import { setupWebSocketServer } from "./infrastructure/websocket/WebSocketServer";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./infrastructure/swagger";
import { ErrorHandler } from "./infrastructure/ErrorApp";
import fs from "fs";
import path from "path";

import { errorMiddleware } from "./interface/middleware/ErrorMiddleware";

export const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) =>
      o.trim().replace(/^["']|["']$/g, "")
    )
  : ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// --- Dependency Injection ---
import { setupContainer } from "./infrastructure/di/container";

const container = setupContainer();

const applicationController = container.resolve("applicationController");
const authController = container.resolve("authController");
const userController = container.resolve("userController");
const talentController = container.resolve("talentController");
const agencyController = container.resolve("agencyController");
const projectController = container.resolve("projectController");
const taskController = container.resolve("taskController");
const hireRequestController = container.resolve("hireRequestController");
const teamController = container.resolve("teamController");
const messageController = container.resolve("messageController");
const notificationController = container.resolve("notificationController");
const cmsController = container.resolve("cmsController");
const auditLogController = container.resolve("auditLogController");
const contractController = container.resolve("contractController");
const disputeController = container.resolve("disputeController");
const workVerificationController = container.resolve(
  "workVerificationController",
);
const systemSettingController = container.resolve("systemSettingController");

const systemSettingService = container.resolve("systemSettingService");
const messageService = container.resolve("messageService");
const userRepo = container.resolve("userRepo");

// Middleware to block traffic during maintenance (except for admin/auth)
// (Placed after DI so services are available)
app.use(maintenanceMiddleware(systemSettingService));

// --- Routes ---
app.use(
  "/api/applications",
  Router.createApplicationRoutes(applicationController)
);
app.use("/api/auth", Router.createAuthRoutes(authController));
app.use("/api/users", Router.createUserRoutes(userController));
app.use("/api/talents", Router.createTalentRoutes(talentController));
app.use("/api/agencies", Router.createAgencyRoutes(agencyController));
app.use("/api/projects", Router.createProjectRoutes(projectController));
app.use("/api/tasks", Router.createTaskRoutes(taskController));
app.use(
  "/api/hire-requests",
  Router.createHireRequestRoutes(hireRequestController)
);
app.use("/api/teams", Router.createTeamRoutes(teamController));
app.use("/api/messages", Router.createMessageRoutes(messageController));
app.use(
  "/api/notifications",
  Router.createNotificationRoutes(notificationController)
);
app.use("/api/cms", Router.createCMSRoutes(cmsController));
app.use(
  "/api/admin/audit-logs",
  Router.createAuditLogRoutes(auditLogController)
);
app.use("/api/contracts", Router.createContractRoutes(contractController));
app.use("/api/disputes", Router.createDisputeRoutes(disputeController));
app.use(
  "/api/work-verification",
  Router.setupWorkVerificationRoutes(workVerificationController)
);
app.use(
  "/api/settings",
  Router.createSystemSettingRoutes(systemSettingController)
);

// ------ Error Handling -------
app.use(ErrorHandler);


// --- Swagger Documentation ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Export Swagger JSON for FE team
const apiDir = path.join(__dirname, "../api");
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}
fs.writeFileSync(
  path.join(apiDir, "swagger.json"),
  JSON.stringify(swaggerSpec, null, 2),
);

// Legacy compatibility for notifications
app.use(
  "/api/applications/notifications",
  Router.createNotificationRoutes(notificationController)
);

app.use(errorMiddleware);

app.get("/health", (req, res) => {
  res.json({ status: "ok", architecture: "Layered Clean Architecture" });
});

const server = http.createServer(app);
setupWebSocketServer(server, messageService);

if (require.main === module) {
  server.listen(PORT, async () => {
    console.log(`Backend Server running on port ${PORT}`);
    try {
      await userRepo.ensureSupportUser("support-system-user-id-001");
      console.log("Support user ensured");
    } catch (err) {
      console.error("Failed to ensure support user:", err);
    }
  });
}