import { Request, Response, NextFunction } from 'express';
import { CMSService } from '../../application/services/CMSService';
import { AuthRequest } from '../middleware/AuthMiddleware';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class CMSController {
    private cmsService: CMSService;

    constructor({ cmsService }: { cmsService: CMSService }) {
        this.cmsService = cmsService;
    }

    // FAQs
    listFAQs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const faqs = await this.cmsService.listFAQs();
            res.json(faqs);
        } catch (error: any) {
            next(error);
        }
    }
    createFAQ = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const faq = await this.cmsService.createFAQ(req.user!.id, req.body);
            res.json(faq);
        } catch (error: any) {
            next(error);
        }
    }
    updateFAQ = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const faq = await this.cmsService.updateFAQ(req.user!.id, req.params.id, req.body);
            res.json(faq);
        } catch (error: any) {
            next(error);
        }
    }
    deleteFAQ = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await this.cmsService.deleteFAQ(req.user!.id, req.params.id);
            res.json({ message: 'Deleted' });
        } catch (error: any) {
            next(error);
        }
    }

    // Testimonials
    listTestimonials = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const items = await this.cmsService.listTestimonials();
            res.json(items);
        } catch (error: any) {
            next(error);
        }
    }
    createTestimonial = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const item = await this.cmsService.createTestimonial(req.user!.id, req.body);
            res.json(item);
        } catch (error: any) {
            next(error);
        }
    }
    updateTestimonial = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const item = await this.cmsService.updateTestimonial(req.user!.id, req.params.id, req.body);
            res.json(item);
        } catch (error: any) {
            next(error);
        }
    }
    deleteTestimonial = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await this.cmsService.deleteTestimonial(req.user!.id, req.params.id);
            res.json({ message: 'Deleted' });
        } catch (error: any) {
            next(error);
        }
    }

    // Case Studies
    listCaseStudies = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const items = await this.cmsService.listCaseStudies();
            res.json(items);
        } catch (error: any) {
            next(error);
        }
    }
    createCaseStudy = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const item = await this.cmsService.createCaseStudy(req.user!.id, req.body);
            res.json(item);
        } catch (error: any) {
            next(error);
        }
    }
    updateCaseStudy = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const item = await this.cmsService.updateCaseStudy(req.user!.id, req.params.id, req.body);
            res.json(item);
        } catch (error: any) {
            next(error);
        }
    }
    deleteCaseStudy = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await this.cmsService.deleteCaseStudy(req.user!.id, req.params.id);
            res.json({ message: 'Deleted' });
        } catch (error: any) {
            next(error);
        }
    }

    // Blog Posts
    listBlogPosts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const items = await this.cmsService.listBlogPosts();
            res.json(items);
        } catch (error: any) {
            next(error);
        }
    }
    createBlogPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const item = await this.cmsService.createBlogPost(req.user!.id, req.body);
            res.json(item);
        } catch (error: any) {
            next(error);
        }
    }
    updateBlogPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const item = await this.cmsService.updateBlogPost(req.user!.id, req.params.id, req.body);
            res.json(item);
        } catch (error: any) {
            next(error);
        }
    }
    deleteBlogPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await this.cmsService.deleteBlogPost(req.user!.id, req.params.id);
            res.json({ message: 'Deleted' });
        } catch (error: any) {
            next(error);
        }
    }

    getBlogPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const item = await this.cmsService.getBlogPostBySlug(req.params.slug);
            if (!item) return next(new ErrorApp('Blog post not found', 404));
            res.json(item);
        } catch (error: any) {
            next(error);
        }
    }
}
