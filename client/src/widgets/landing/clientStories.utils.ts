import type { CaseStudy } from '@/shared/types';

export interface ClientStory {
    id: string;
    company: string;
    logo: string;
    thumbnail: string;
    videoUrl: string;
}

export function toClientStories(items: CaseStudy[]): ClientStory[] {
    return items.map(item => ({
        id: item.id,
        company: item.client_name || item.title,
        logo: item.logo || 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
        thumbnail: item.image,
        videoUrl: item.video_url || '',
    }));
}
