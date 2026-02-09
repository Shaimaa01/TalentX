import type { BlogPost } from '@/shared/types';

export type BlogPostCardModel = BlogPost & {
    date: string;
    readTime: string;
};

export function toBlogPostCardModel(posts: BlogPost[]): BlogPostCardModel[] {
    return posts
        .filter(p => p.published)
        .map(p => ({
            ...p,
            date: (p as any).createdAt || new Date().toISOString(),
            readTime: (p as any).readTime || '5 min',
        }));
}
