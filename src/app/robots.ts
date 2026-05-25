import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_URL;

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/', '/*?*', '/id/404', '/en/404']
            },
            {
                userAgent: ['GPTBot', 'CCBot', 'anthropic-ai', 'ClaudeBot', 'Google-Extended'],
                disallow: '/'
            }
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL
    };
}
