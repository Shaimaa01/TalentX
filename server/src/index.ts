import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './infrastructure/database/prisma';

// Repositories
import { PrismaApplicationRepository } from './infrastructure/database/PrismaApplicationRepository';
import { PrismaNotificationRepository } from './infrastructure/database/PrismaNotificationRepository';
import { PrismaUserRepository } from './infrastructure/database/PrismaUserRepository';
import { PrismaTalentRepository } from './infrastructure/database/PrismaTalentRepository';
import { PrismaAgencyRepository } from './infrastructure/database/PrismaAgencyRepository';
import { PrismaProjectRepository } from './infrastructure/database/PrismaProjectRepository';
import { PrismaTaskRepository } from './infrastructure/database/PrismaTaskRepository';
import { PrismaHireRequestRepository } from './infrastructure/database/PrismaHireRequestRepository';
import { PrismaTeamRepository } from './infrastructure/database/PrismaTeamRepository';

import { PrismaMessageRepository } from './infrastructure/database/PrismaMessageRepository';
import { PrismaContractRepository } from './infrastructure/database/PrismaContractRepository';
import { PrismaDisputeRepository } from './infrastructure/database/PrismaDisputeRepository';
import { PrismaTimeLogRepository } from './infrastructure/database/PrismaTimeLogRepository';
import { PrismaMilestoneRepository } from './infrastructure/database/PrismaMilestoneRepository';
import { PrismaSystemSettingRepository } from './infrastructure/database/PrismaSystemSettingRepository';

// Services
import { ApplicationService } from './application/services/ApplicationService';
import { AuthService } from './application/services/AuthService';
import { UserService } from './application/services/UserService';
import { TalentService } from './application/services/TalentService';
import { AgencyService } from './application/services/AgencyService';
import { ProjectService } from './application/services/ProjectService';
import { TaskService } from './application/services/TaskService';
import { HireRequestService } from './application/services/HireRequestService';
import { TeamService } from './application/services/TeamService';
import { MessageService } from './application/services/MessageService';
import { NotificationService } from './application/services/NotificationService';
import { CMSService } from './application/services/CMSService';

import { AuditLogService } from './application/services/AuditLogService';
import { ContractService } from './application/services/ContractService';
import { DisputeService } from './application/services/DisputeService';
import { WorkVerificationService } from './application/services/WorkVerificationService';
import { SystemSettingService } from './application/services/SystemSettingService';

// Controllers
import { ApplicationController } from './interface/controllers/ApplicationController';
import { AuthController } from './interface/controllers/AuthController';
import { UserController } from './interface/controllers/UserController';
import { TalentController } from './interface/controllers/TalentController';
import { AgencyController } from './interface/controllers/AgencyController';
import { ProjectController } from './interface/controllers/ProjectController';
import { TaskController } from './interface/controllers/TaskController';
import { HireRequestController } from './interface/controllers/HireRequestController';
import { TeamController } from './interface/controllers/TeamController';
import { MessageController } from './interface/controllers/MessageController';
import { NotificationController } from './interface/controllers/NotificationController';
import { CMSController } from './interface/controllers/CMSController';

import { AuditLogController } from './interface/controllers/AuditLogController';
import { ContractController } from './interface/controllers/ContractController';
import { DisputeController } from './interface/controllers/DisputeController';
import { WorkVerificationController } from './interface/controllers/WorkVerificationController';
import { SystemSettingController } from './interface/controllers/SystemSettingController';

// Routes
import { createApplicationRoutes } from './interface/routes/ApplicationRoutes';
import { createAuthRoutes } from './interface/routes/AuthRoutes';
import { createUserRoutes } from './interface/routes/UserRoutes';
import { createTalentRoutes } from './interface/routes/TalentRoutes';
import { createAgencyRoutes } from './interface/routes/AgencyRoutes';
import { createProjectRoutes } from './interface/routes/ProjectRoutes';
import { createTaskRoutes } from './interface/routes/TaskRoutes';
import { createHireRequestRoutes } from './interface/routes/HireRequestRoutes';
import { createTeamRoutes } from './interface/routes/TeamRoutes';
import { createMessageRoutes } from './interface/routes/MessageRoutes';
import { createNotificationRoutes } from './interface/routes/NotificationRoutes';
import { createCMSRoutes } from './interface/routes/CMSRoutes';

import { createAuditLogRoutes } from './interface/routes/AuditLogRoutes';
import { createContractRoutes } from './interface/routes/ContractRoutes';
import { createDisputeRoutes } from './interface/routes/DisputeRoutes';
import { setupWorkVerificationRoutes } from './interface/routes/WorkVerificationRoutes';
import { createSystemSettingRoutes } from './interface/routes/SystemSettingRoutes';
import { maintenanceMiddleware } from './interface/middleware/MaintenanceMiddleware';

// External Services
import { StripeService } from './infrastructure/external-services/StripeService';
import { DriveStorageGateway } from './infrastructure/external-services/DriveService';
import { GoogleSheetGateway } from './infrastructure/external-services/GoogleSheetService';
import { setupWebSocketServer } from './infrastructure/websocket/WebSocketServer';
import http from 'http';

import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// --- Dependency Injection ---
const applicationRepo = new PrismaApplicationRepository();
const notificationRepo = new PrismaNotificationRepository();
const userRepo = new PrismaUserRepository();
const talentRepo = new PrismaTalentRepository();
const agencyRepo = new PrismaAgencyRepository();
const projectRepo = new PrismaProjectRepository();
const taskRepo = new PrismaTaskRepository();
const hireRequestRepo = new PrismaHireRequestRepository();
const teamRepo = new PrismaTeamRepository();

const messageRepo = new PrismaMessageRepository();
const contractRepo = new PrismaContractRepository(prisma);
const disputeRepo = new PrismaDisputeRepository(prisma);
const timeLogRepo = new PrismaTimeLogRepository(prisma);
const milestoneRepo = new PrismaMilestoneRepository(prisma);
const systemSettingRepo = new PrismaSystemSettingRepository(prisma);

const stripeService = new StripeService();
const storageGateway = new DriveStorageGateway();
const sheetGateway = new GoogleSheetGateway();

const applicationService = new ApplicationService(applicationRepo, notificationRepo, userRepo, storageGateway, sheetGateway);
const authService = new AuthService(userRepo, notificationRepo, stripeService);
const auditLogService = new AuditLogService(prisma);
const userService = new UserService(userRepo, auditLogService);
const talentService = new TalentService(talentRepo);
const agencyService = new AgencyService(agencyRepo);
const projectService = new ProjectService(projectRepo, notificationRepo, talentRepo, auditLogService);
const taskService = new TaskService(taskRepo, notificationRepo);
const hireRequestService = new HireRequestService(hireRequestRepo, notificationRepo, talentRepo, agencyRepo, projectRepo);
const teamService = new TeamService(teamRepo, projectRepo, talentRepo);
const messageService = new MessageService(messageRepo, notificationRepo, userRepo);
const notificationService = new NotificationService(notificationRepo);

const cmsService = new CMSService(prisma, auditLogService);
const contractService = new ContractService(contractRepo, talentRepo, agencyRepo, projectRepo, notificationRepo);
const disputeService = new DisputeService(disputeRepo, projectRepo);
const workVerificationService = new WorkVerificationService(timeLogRepo, milestoneRepo, projectRepo, talentRepo, notificationRepo);
const systemSettingService = new SystemSettingService(systemSettingRepo);

// Middleware to block traffic during maintenance (except for admin/auth)
// (Placed after DI so services are available)
app.use(maintenanceMiddleware(systemSettingService));

const applicationController = new ApplicationController(applicationService);
const authController = new AuthController(authService);
const userController = new UserController(userService);
const talentController = new TalentController(talentService);
const agencyController = new AgencyController(agencyService);
const projectController = new ProjectController(projectService);
const taskController = new TaskController(taskService);
const hireRequestController = new HireRequestController(hireRequestService);
const teamController = new TeamController(teamService);
const messageController = new MessageController(messageService);
const notificationController = new NotificationController(notificationService);
const cmsController = new CMSController(cmsService);
const auditLogController = new AuditLogController(auditLogService);
const contractController = new ContractController(contractService);
const disputeController = new DisputeController(disputeService);
const workVerificationController = new WorkVerificationController(workVerificationService);
const systemSettingController = new SystemSettingController(systemSettingService);

// --- Routes ---
app.use('/api/applications', createApplicationRoutes(applicationController));
app.use('/api/auth', createAuthRoutes(authController));
app.use('/api/users', createUserRoutes(userController));
app.use('/api/talents', createTalentRoutes(talentController));
app.use('/api/agencies', createAgencyRoutes(agencyController));
app.use('/api/projects', createProjectRoutes(projectController));
app.use('/api/tasks', createTaskRoutes(taskController));
app.use('/api/hire-requests', createHireRequestRoutes(hireRequestController));
app.use('/api/teams', createTeamRoutes(teamController));
app.use('/api/messages', createMessageRoutes(messageController));
app.use('/api/message', createMessageRoutes(messageController)); // Alias
app.use('/messages', createMessageRoutes(messageController)); // Root alias
app.use('/api/notifications', createNotificationRoutes(notificationController));
app.use('/api/cms', createCMSRoutes(cmsController));
app.use('/api/admin/audit-logs', createAuditLogRoutes(auditLogController));
app.use('/api/contracts', createContractRoutes(contractController));
app.use('/api/disputes', createDisputeRoutes(disputeController));
app.use('/api/work-verification', setupWorkVerificationRoutes(workVerificationController));
app.use('/api/settings', createSystemSettingRoutes(systemSettingController));

// Legacy compatibility for notifications
app.use('/api/applications/notifications', createNotificationRoutes(notificationController));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', architecture: 'Layered Clean Architecture' });
});

const server = http.createServer(app);
setupWebSocketServer(server, messageService);

server.listen(PORT, async () => {
    console.log(`Backend Server running on port ${PORT}`);
    try {
        await userRepo.ensureSupportUser('support-system-user-id-001');
        console.log('Support user ensured');
    } catch (err) {
        console.error('Failed to ensure support user:', err);
    }
});
