import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_URL;

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/', '/*?*', '/id/404', '/en/404']
            },
            { userAgent: 'GPTBot', disallow: '/' },
            { userAgent: 'CCBot', disallow: '/' },
            { userAgent: 'anthropic-ai', disallow: '/' },
            { userAgent: 'ClaudeBot', disallow: '/' },
            { userAgent: 'Google-Extended', disallow: '/' }
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL
    };
}
