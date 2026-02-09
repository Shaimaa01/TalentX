import type { QueryKey } from '@tanstack/react-query';

export type DatasetType = 'static' | 'dynamic';

export function getDatasetTypeByKey(queryKey: QueryKey): DatasetType {
    const root = Array.isArray(queryKey) ? queryKey[0] : queryKey;

    if (typeof root === 'string') {
        if (root.startsWith('cms-')) return 'static';
        if (root === 'blog-posts' || root === 'blog-post') return 'static';
    }

    return 'dynamic';
}
