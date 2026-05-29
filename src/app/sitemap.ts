import { MetadataRoute } from 'next';

import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-endpoints';
import { knowledgeCategorySlugs, newsCategorySlugs } from '@/types/categories';

const BASE_URL = (process.env.NEXT_URL ?? '').replace(/\/+$/, '');
const LOCALES = ['id', 'en'] as const;

export const revalidate = 3600;

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency'];

interface SitemapPost {
    id: number;
    category: { slug: string };
    translations: { language: string; slug: string }[];
    updated_at: string;
}

const STATIC_ROUTES: Array<{
    path: string;
    changeFrequency: ChangeFrequency;
    priority: number;
}> = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/news-from-us', changeFrequency: 'daily', priority: 0.9 },
    { path: '/knowledge', changeFrequency: 'daily', priority: 0.9 },
    { path: '/about/profile-infid', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/about/member-infid', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/about/structure-organization', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/about/research', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/about/partner', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/involved', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/involved/career', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/quiz', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact-us', changeFrequency: 'yearly', priority: 0.5 }
];

function resolveSection(categorySlug: string): 'knowledge' | 'news-from-us' | null {
    if ((knowledgeCategorySlugs as readonly string[]).includes(categorySlug)) {
        return 'knowledge';
    }
    if ((newsCategorySlugs as readonly string[]).includes(categorySlug)) {
        return 'news-from-us';
    }
    return null;
}

async function fetchSitemapPosts(): Promise<SitemapPost[]> {
    if (!API_BASE_URL) {
        console.error('[sitemap] NEXT_PUBLIC_API_URL is not defined');
        return [];
    }

    const endpoint = `${API_BASE_URL.replace(/\/+$/, '')}${API_ENDPOINTS.postsSitemap}`;

    try {
        const response = await fetch(endpoint, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            console.error(`[sitemap] API ${response.status} ${response.statusText}`);
            return [];
        }

        const payload = (await response.json()) as { data?: SitemapPost[] };
        const posts = Array.isArray(payload?.data) ? payload.data : [];
        console.log(`[sitemap] Fetched ${posts.length} posts`);
        return posts;
    } catch (error) {
        console.error('[sitemap] Failed to fetch posts:', error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((route) =>
        LOCALES.map((locale) => ({
            url: `${BASE_URL}/${locale}${route.path}`,
            lastModified: now,
            changeFrequency: route.changeFrequency,
            priority: route.priority
        }))
    );

    const posts = await fetchSitemapPosts();

    const articlePages: MetadataRoute.Sitemap = posts.flatMap((post) => {
        const section = resolveSection(post.category?.slug);
        if (!section) return [];

        const lastModified = post.updated_at ? new Date(post.updated_at) : now;

        return post.translations
            .filter((t) => LOCALES.includes(t.language as (typeof LOCALES)[number]) && t.slug)
            .map((t) => ({
                url: `${BASE_URL}/${t.language}/${section}/${post.id}-${t.slug}`,
                lastModified,
                changeFrequency: 'weekly' as const,
                priority: 0.7
            }));
    });

    return [...staticPages, ...articlePages];
}
