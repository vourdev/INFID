import { MetadataRoute } from 'next';

import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { apiRequest } from '@/lib/api-request';
import { Post } from '@/types/posts';

const BASE_URL = 'https://infid.org';

export const revalidate = 3600; // cache 1 jam

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/id`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0
        },
        {
            url: `${BASE_URL}/en`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0
        },
        {
            url: `${BASE_URL}/id/news-from-us`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9
        },
        {
            url: `${BASE_URL}/en/news-from-us`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9
        }
        // TODO: tambahkan static pages lain (about, contact, dll) sesuai struktur infid.org
    ];

    // Dynamic article pages
    let articlePages: MetadataRoute.Sitemap = [];

    try {
        const res = await apiRequest.get<Post[]>(API_ENDPOINTS.posts, {
            params: {
                limit: 1000,
                page: 1
            }
        });

        const articles = res.data || [];

        articlePages = articles
            .filter((post) => post.status?.toLowerCase() === 'published')
            .flatMap((post) => {
                const slug = post.translations?.[0]?.slug;
                if (!slug) return [];

                const urlPath = `news-from-us/${post.id}-${slug}`;
                const lastModified = post.updated_at ? new Date(post.updated_at) : new Date();

                return [
                    {
                        url: `${BASE_URL}/id/${urlPath}`,
                        lastModified,
                        changeFrequency: 'weekly' as const,
                        priority: 0.7
                    },
                    {
                        url: `${BASE_URL}/en/${urlPath}`,
                        lastModified,
                        changeFrequency: 'weekly' as const,
                        priority: 0.7
                    }
                ];
            });
    } catch (error) {
        console.error('Failed to generate sitemap for articles:', error);
    }

    return [...staticPages, ...articlePages];
}
