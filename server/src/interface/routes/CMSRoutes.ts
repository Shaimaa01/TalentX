import { Router } from 'express';
import { CMSController } from '../controllers/CMSController';
import { authenticateToken, requireRole } from '../middleware/AuthMiddleware';

export const createCMSRoutes = (cmsController: CMSController) => {
    const router = Router();

    // Public getters
    router.get('/faqs', cmsController.listFAQs);
    router.get('/testimonials', cmsController.listTestimonials);
    router.get('/case-studies', cmsController.listCaseStudies);
    router.get('/blog-posts', cmsController.listBlogPosts);
    router.get('/blog-posts/slug/:slug', cmsController.getBlogPostBySlug);

    // Protected mutations
    router.use(authenticateToken);
    router.use(requireRole(['admin']));

    router.post('/faqs', cmsController.createFAQ);
    router.patch('/faqs/:id', cmsController.updateFAQ);
    router.delete('/faqs/:id', cmsController.deleteFAQ);

    router.post('/testimonials', cmsController.createTestimonial);
    router.patch('/testimonials/:id', cmsController.updateTestimonial);
    router.delete('/testimonials/:id', cmsController.deleteTestimonial);

    router.post('/case-studies', cmsController.createCaseStudy);
    router.patch('/case-studies/:id', cmsController.updateCaseStudy);
    router.delete('/case-studies/:id', cmsController.deleteCaseStudy);

    router.post('/blog-posts', cmsController.createBlogPost);
    router.patch('/blog-posts/:id', cmsController.updateBlogPost);
    router.delete('/blog-posts/:id', cmsController.deleteBlogPost);

    return router;
};
