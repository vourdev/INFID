import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { apiRequest } from '@/lib/api-request';
import { getShortDescription } from '@/lib/utils';
import { Post } from '@/types/posts';

import DetailKnowledgeClient from './detail-knowledge-client';

async function getPostDetail(id: string) {
    try {
        const res = await apiRequest.get<Post>(`${API_ENDPOINTS.posts}/${id}`);
        return res.data || null;
    } catch (error) {
        console.error('Fetch Detail Error:', error);
        return null;
    }
}

function extractIdFromSlug(slug: string): string | null {
    const id = slug.split('-')[0];
    if (!id || !/^\d+$/.test(id)) {
        return null;
    }
    return id;
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const { locale, slug } = resolvedParams;

    const id = extractIdFromSlug(slug);
    if (!id) {
        return { title: 'Knowledge Not Found' };
    }

    const data = await getPostDetail(id);
    if (!data) {
        return { title: 'Knowledge Not Found' };
    }

    const translation =
        data?.translations?.find((t) => t.language === locale) ||
        data?.translations?.find((t) => t.language === 'id') ||
        data?.translations?.[0];

    const title = translation?.title || 'Detail Knowledge';
    const description = getShortDescription(translation?.content);

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: data?.cover ? [data.cover] : [],
            type: 'article'
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            images: data?.cover ? [data.cover] : []
        }
    };
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const resolvedParams = await params;
    const { locale, slug } = resolvedParams;

    const id = extractIdFromSlug(slug);
    if (!id) {
        notFound();
    }

    const data = await getPostDetail(id);

    if (!data) {
        notFound();
    }

    // Optional: cek status published
    if (data.status?.toLowerCase() !== 'published') {
        notFound();
    }

    return <DetailKnowledgeClient initialData={data} locale={locale} postId={id} />;
}
