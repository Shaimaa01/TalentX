import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function createPageUrl(page: string): string {
    if (page === 'Home') return '/';

    // Handle query params and fragments
    const [pagePath, query] = page.split('?');
    const [path, fragment] = pagePath.split('#');

    // Convert PascalCase to kebab-case
    const kebabPath =
        path === 'Home' ? '' : path.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

    // Manual overrides for special cases
    const overrides: Record<string, string> = {
        'about-us': '/about',
        'why-talent-x': '/why-talentx',
    };

    const finalPath = overrides[kebabPath] || (kebabPath ? '/' + kebabPath : '/');
    return finalPath + (fragment ? `#${fragment}` : '') + (query ? `?${query}` : '');
}
