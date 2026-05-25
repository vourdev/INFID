import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const isProduction = process.env.VERCEL_ENV === 'production';

    // Block crawler di preview/development deployment
    if (!isProduction) {
        return {
            rules: { userAgent: '*', disallow: '/' }
        };
    }

    // Production: allow crawling
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/_next/']
        },
        sitemap: 'https://infid.org/sitemap.xml'
    };
}
