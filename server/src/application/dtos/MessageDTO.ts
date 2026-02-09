import { z } from 'zod';

export const CreateMessageSchema = z.object({
    receiver_id: z.string().optional(), // Optional - will be set to SUPPORT_ID if isSupport=true
    content: z.string().min(1, 'Content is required'),
    isSupport: z.union([z.boolean(), z.string()]).optional(), // Handle "true" string from query/body sometimes
});

export const MarkReadSchema = z.object({
    isSupport: z.boolean().optional(),
    threadUserId: z.string().optional(),
});

export type CreateMessageDTO = z.infer<typeof CreateMessageSchema>;
export type MarkReadDTO = z.infer<typeof MarkReadSchema>;
