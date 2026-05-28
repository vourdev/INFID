import { MetadataRoute } from 'next';

import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-endpoints';
import { Post } from '@/types/posts';

const BASE_URL = (process.env.NEXT_URL ?? '').replace(/\/+$/, '');
const LOCALES = ['id', 'en'] as const;
const NEWS_CATEGORIES = 'Kegiatan|Siaran Pers|Laporan Tahunan';
const NEWS_LIMIT = 100;

export const revalidate = 3600;

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency'];

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

async function fetchLatestNewsPosts(): Promise<Post[]> {
    if (!API_BASE_URL) {
        console.error('[sitemap] NEXT_PUBLIC_API_URL is not defined — skipping article URLs');
        return [];
    }

    const params = new URLSearchParams({
        category: NEWS_CATEGORIES,
        limit: String(NEWS_LIMIT),
        page: '1',
        year: '',
        author: '',
        tags: '',
        search: ''
    });
    const endpoint = `${API_BASE_URL.replace(/\/+$/, '')}${API_ENDPOINTS.posts}?${params.toString()}`;

    try {
        const response = await fetch(endpoint, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            console.error(`[sitemap] Posts API ${response.status} ${response.statusText}`);
            return [];
        }

        const payload = (await response.json()) as { data?: Post[] };
        const posts = Array.isArray(payload?.data) ? payload.data : [];
        console.log(`[sitemap] Fetched ${posts.length} news posts`);
        return posts;
    } catch (error) {
        console.error('[sitemap] Failed to fetch news posts:', error);
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

    const posts = await fetchLatestNewsPosts();

    const articlePages: MetadataRoute.Sitemap = posts
        .filter((post) => post.status?.toLowerCase() === 'published')
        .flatMap((post) => {
            const lastModified = post.updated_at ? new Date(post.updated_at) : now;

            return LOCALES.flatMap((locale) => {
                const translation =
                    post.translations?.find((t) => t.language === locale) ?? post.translations?.[0];
                const slug = translation?.slug;
                if (!slug) return [];

                return [
                    {
                        url: `${BASE_URL}/${locale}/news-from-us/${post.id}-${slug}`,
                        lastModified,
                        changeFrequency: 'weekly' as const,
                        priority: 0.7
                    }
                ];
            });
        });

    return [...staticPages, ...articlePages];
}
