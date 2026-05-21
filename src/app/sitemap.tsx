import { MetadataRoute } from 'next';

import { API_ENDPOINTS } from '@/lib/api-endpoints';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.posts}?limit=1000`);
    const data = await res.json();
    const articles = data.data || [];

    return articles
        .filter((a: any) => a.status.toLowerCase() === 'published')
        .map((article: any) => ({
            url: `https://infid.org/id/news-from-us/${article.id}-${article.translations[0]?.slug}`,
            lastModified: article.updated_at,
            changeFrequency: 'weekly' as const,
            priority: 0.7
        }));
}
