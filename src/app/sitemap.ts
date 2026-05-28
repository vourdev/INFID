import { MetadataRoute } from 'next';

import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-endpoints';
import { allowedKnowledgeCategories, allowedNewsCategories } from '@/types/categories';
import { Post } from '@/types/posts';

const BASE_URL = (process.env.NEXT_URL ?? '').replace(/\/+$/, '');
const LOCALES = ['id', 'en'] as const;

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

const isKnowledgeCategory = (categoryName?: string) =>
    !!categoryName && allowedKnowledgeCategories.some((c) => c.id === categoryName || c.en === categoryName);

const isNewsCategory = (categoryName?: string) =>
    !!categoryName && allowedNewsCategories.some((c) => c.id === categoryName || c.en === categoryName);

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

    let articlePages: MetadataRoute.Sitemap = [];

    if (!API_BASE_URL) {
        console.error('[sitemap] NEXT_PUBLIC_API_URL is not defined — skipping article URLs');
        return [...staticPages, ...articlePages];
    }

    try {
        const endpoint = `${API_BASE_URL.replace(/\/+$/, '')}${API_ENDPOINTS.posts}?limit=1000&page=1`;
        const response = await fetch(endpoint, {
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            console.error(
                `[sitemap] Posts API responded with ${response.status} ${response.statusText} for ${endpoint}`
            );
            return [...staticPages, ...articlePages];
        }

        const payload = (await response.json()) as {
            data?: Post[] | { data?: Post[] };
        } & { [key: string]: unknown };

        const rawData = payload?.data;
        const articlesRaw: Post[] = Array.isArray(rawData)
            ? rawData
            : Array.isArray((rawData as { data?: Post[] })?.data)
              ? ((rawData as { data?: Post[] }).data ?? [])
              : Array.isArray(payload as unknown as Post[])
                ? (payload as unknown as Post[])
                : [];

        console.log(`[sitemap] Fetched ${articlesRaw.length} posts from API`);

        const articles = articlesRaw.filter(
            (post) => post.status?.toLowerCase() === 'published'
        );

        articlePages = articles.flatMap((post) => {
            const lastModified = post.updated_at ? new Date(post.updated_at) : now;
            const categoryTranslations = post.category?.name ?? [];
            const matchedKnowledge = categoryTranslations.some((t) => isKnowledgeCategory(t.text));
            const matchedNews = categoryTranslations.some((t) => isNewsCategory(t.text));

            const segments: string[] = [];
            if (matchedKnowledge) segments.push('knowledge');
            if (matchedNews) segments.push('news-from-us');
            if (segments.length === 0) segments.push('news-from-us');

            return LOCALES.flatMap((locale) => {
                const translation =
                    post.translations?.find((t) => t.language === locale) ?? post.translations?.[0];
                const slug = translation?.slug;
                if (!slug) return [];

                return segments.map((segment) => ({
                    url: `${BASE_URL}/${locale}/${segment}/${post.id}-${slug}`,
                    lastModified,
                    changeFrequency: 'weekly' as const,
                    priority: 0.7
                }));
            });
        });
    } catch (error) {
        console.error('Failed to generate sitemap for articles:', error);
    }

    return [...staticPages, ...articlePages];
}
