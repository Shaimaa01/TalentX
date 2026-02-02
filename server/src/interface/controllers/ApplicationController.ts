import { Request, Response, NextFunction } from 'express';
import { CreateApplicationSchema } from '../../application/dtos/ApplicationDTO';
import { ApplicationService } from '../../application/services/ApplicationService';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class ApplicationController {
    private applicationService: ApplicationService;

    constructor({ applicationService }: { applicationService: ApplicationService }) {
        this.applicationService = applicationService;
    }

    submitApplication = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 1. Validate Input (Zod)
            const validationResult = CreateApplicationSchema.safeParse(req.body);

            if (!validationResult.success) {
                return next(new ErrorApp("Validation Error", 400, JSON.stringify(validationResult.error.issues)));
            }

            // 2. Call Service
            const application = await this.applicationService.submitApplication(
                validationResult.data,
                req.file
            );

            res.status(201).json({
                message: 'Application submitted successfully',
                applicationId: application.id
            });

        } catch (error: any) {
            next(error);
        }
    };

    getApplications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const applications = await this.applicationService.getAllApplications();

            // Transform for frontend if needed (keeping existing shape logic)
            const formattedApps = applications.map(app => ({
                id: app.id,
                userId: null,
                type: app.role,
                name: app.full_name,
                email: app.email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.full_name)}&background=random`,
                role: app.role === 'talent' ? app.title : 'Agency',
                status: app.status,
                appliedAt: app.created_at || (app as any).applied_at, // Handle potential field name diff
                resumeUrl: app.resume_url,
                details: app,
            }));

            res.json(formattedApps);
        } catch (error) {
            next(error);
        }
    };

    deleteApplication = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            await this.applicationService.deleteApplication(id);
            res.json({ message: 'Application deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { status } = req.body;
        try {
            await this.applicationService.updateStatus(id, status);
            res.json({ message: `Application status updated to ${status}` });
        } catch (error: any) {
            next(error);
        }
    }

    getSheetUrl = async (req: Request, res: Response, next: NextFunction) => {
        const sheetId = process.env.GOOGLE_SHEET_ID;
        if (sheetId) {
            res.json({ url: `https://docs.google.com/spreadsheets/d/${sheetId}` });
        } else {
            next(new ErrorApp("Google Sheet ID not configured", 404));
        }
    };
}
