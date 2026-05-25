import { MetadataRoute } from 'next';

import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { apiRequest } from '@/lib/api-request';
import { allowedKnowledgeCategories, allowedNewsCategories } from '@/types/categories';
import { Post } from '@/types/posts';

const BASE_URL = process.env.NEXT_URL;
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

    try {
        const res = await apiRequest.get<Post[]>(API_ENDPOINTS.posts, {
            params: { limit: 1000, page: 1 }
        });

        const articles = (res.data || []).filter((post) => post.status?.toLowerCase() === 'published');

        articlePages = articles.flatMap((post) => {
            const slug = post.translations?.[0]?.slug;
            if (!slug) return [];

            const categoryName = post.category?.name?.[0]?.text;
            const lastModified = post.updated_at ? new Date(post.updated_at) : now;

            let basePath: string | null = null;
            if (isKnowledgeCategory(categoryName)) {
                basePath = `knowledge/${post.id}-${slug}`;
            } else if (isNewsCategory(categoryName)) {
                basePath = `news-from-us/${post.id}-${slug}`;
            }

            if (!basePath) return [];

            return LOCALES.map((locale) => ({
                url: `${BASE_URL}/${locale}/${basePath}`,
                lastModified,
                changeFrequency: 'weekly' as const,
                priority: 0.7
            }));
        });
    } catch (error) {
        console.error('Failed to generate sitemap for articles:', error);
    }

    return [...staticPages, ...articlePages];
}
