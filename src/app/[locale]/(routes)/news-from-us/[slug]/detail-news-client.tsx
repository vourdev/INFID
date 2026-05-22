'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { ArticleCard } from '@/components/common/article-card';
import { ArticleContent } from '@/components/common/article-content';
import { ArticleHeader } from '@/components/common/article-header';
import { ArticleShareBar } from '@/components/common/article-share-bar';
import PageHeader from '@/components/common/background-section';
import CommentSection from '@/components/common/comment-article';
import { LatestArticleCard } from '@/components/common/latest-article-card';
import OptimizedImage from '@/components/common/optimized-image';
import { Button } from '@/components/ui/button';
import { Link as Navigate, useRouter } from '@/i18n/navigation';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { apiRequest } from '@/lib/api-request';
import { convertToEmbedUrl, getLangText } from '@/lib/utils';
import { Post, PostTranslation, Tags } from '@/types/posts';

import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface Props {
    initialData: Post | null;
    locale: string;
    postId: string;
}

const DetailNewsClient = ({ initialData, locale, postId }: Props) => {
    const t = useTranslations('news');
    const router = useRouter();

    const [relatedArticles, setRelatedArticles] = useState<Post[]>([]);
    const [latestArticles, setLatestArticles] = useState<Post[]>([]);

    const translation =
        initialData?.translations?.find((t: PostTranslation) => t.language === locale) ||
        initialData?.translations?.find((t: PostTranslation) => t.language === 'id') ||
        initialData?.translations?.[0];

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const [relatedRes, latestRes] = await Promise.all([
                    apiRequest.get<Post[]>(API_ENDPOINTS.posts, {
                        params: {
                            category: getLangText(initialData?.category.name, locale) || '',
                            limit: 4,
                            page: 1,
                            search: '',
                            author: '',
                            tags: '',
                            year: '',
                            random: true
                        }
                    }),
                    apiRequest.get<Post[]>(API_ENDPOINTS.posts, {
                        params: {
                            limit: 4,
                            page: 1,
                            category: '',
                            search: '',
                            author: '',
                            tags: '',
                            year: '',
                            random: false
                        }
                    })
                ]);

                const filteredRelated =
                    (relatedRes.data || relatedRes).filter(
                        (item) =>
                            (item.status.toLowerCase() == 'published' &&
                                getLangText(item.category.name) !== 'Infografis') ||
                            getLangText(item.category.name) !== 'Infograhic'
                    ) || [];
                setRelatedArticles(filteredRelated);
                setLatestArticles(
                    latestRes.data.filter(
                        (item) =>
                            (item.status.toLowerCase() == 'published' &&
                                getLangText(item.category.name) !== 'Infografis') ||
                            getLangText(item.category.name) !== 'Infograhic'
                    ) ||
                        [] ||
                        latestRes
                );
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };

        fetchSuggestions();
    }, [initialData?.id, initialData?.category?.name]);

    const handleDownload = async (article: Post | null) => {
        const idAttachment = translation?.attachments?.filter((item) => item.type === 'pdf')[0].id;
        if (!idAttachment) {
            toast.error('Invalid article');
            return;
        }

        try {
            await apiRequest.get(`${API_ENDPOINTS.postsAttachment}/${idAttachment}/download`);
        } catch (error) {
            console.error('Failed to track download:', error);
        }

        const pdfAttachment = translation?.attachments?.find((item) => item.type === 'pdf');

        const filePath = pdfAttachment?.file_path;

        if (filePath) {
            window.open(filePath, '_blank');
        } else {
            toast.error('PDF attachment not available');
        }
    };

    const handleAddComment = async (values: any) => {
        try {
            const payload = {
                name: values.nama,
                email: values.email,
                comment: values.komentar
            };
            const res = await apiRequest.post(`${API_ENDPOINTS.posts}/${postId}/comment`, payload);
            if (res.status_code === 200 || res.status_code === 201) {
                toast.success(res.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed sent comment');
        }
    };

    const handleArticleClick = async (article: Post) => {
        try {
            await apiRequest.get<Post>(`${API_ENDPOINTS.posts}/${article.id}/view`);
        } catch (error) {
            console.error('Failed to track view:', error);
        }

        router.push(`/news-from-us/${article.id}-${article.translations[0]?.slug}`);
    };

    return (
        <section className='w-full bg-stone-50'>
            <PageHeader
                title='Kabar dari Kami'
                showTitle={false}
                article={true}
                backgroundImage='/images/background-about-us.webp'
                breadcrumbs={[
                    { label: t('breadcrumb.home'), href: '/' },
                    { label: t('breadcrumb.about'), href: '/news-from-us' },
                    { label: translation?.title ?? '', active: true }
                ]}
                containerClassName='h-38 pt-14'
            />

            <div className='container py-16'>
                <div className='flex w-full flex-col items-start justify-center gap-10 xl:flex-row'>
                    <div className='flex w-full flex-col gap-8'>
                        <ArticleHeader data={initialData} translation={translation} />

                        <div className='flex items-center justify-between gap-4'>
                            <h3 className='text-secondary-300 font-bold uppercase'>
                                {getLangText(initialData?.category.name, locale) === 'Cerita Perubahan' ||
                                getLangText(initialData?.category.name, locale) === 'Stories of Change'
                                    ? 'Bergerak, Berdampak!'
                                    : getLangText(initialData?.category.name, locale)}
                            </h3>
                            {translation?.attachments?.some((item) => item.type === 'pdf') && (
                                <Button
                                    className='rounded-full'
                                    size={'sm'}
                                    onClick={() => handleDownload(initialData)}>
                                    <Download className='mr-2 h-4 w-4' />
                                    {t('content.attachments')}
                                </Button>
                            )}
                        </div>

                        {(() => {
                            const audioFile = translation?.attachments?.find((item) => item.type === 'audio');

                            if (!audioFile) return null;

                            return (
                                <div className='mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-4'>
                                    <p className='mb-2 text-xs font-medium text-slate-500'>Audio Attachment:</p>
                                    <audio controls className='w-full'>
                                        <source src={audioFile.file_path} type='audio/mpeg' />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            );
                        })()}

                        <OptimizedImage
                            width={1200}
                            height={630}
                            src={initialData?.cover || '/images/placeholder-square.png'}
                            alt={translation?.title || 'Cover'}
                            fill={false}
                            className='h-auto w-full rounded-lg object-cover'
                        />

                        {initialData?.youtube_link && (
                            <div className='mt-4 aspect-video w-full overflow-hidden rounded-lg'>
                                <iframe
                                    className='h-full w-full'
                                    src={convertToEmbedUrl(initialData.youtube_link)}
                                    title='YouTube video'
                                    frameBorder='0'
                                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                    allowFullScreen
                                />
                            </div>
                        )}

                        <ArticleContent content={translation?.content || ''} />

                        <ArticleShareBar
                            categoryName={
                                getLangText(initialData?.category.name, locale) === 'Cerita Perubahan' ||
                                getLangText(initialData?.category.name, locale) === 'Stories of Change'
                                    ? 'Bergerak, Berdampak!'
                                    : getLangText(initialData?.category.name, locale)
                            }
                            title={translation?.title}
                        />

                        <CommentSection comments={initialData?.comments || []} onSubmit={handleAddComment} />
                    </div>

                    {/* Sidebar */}
                    <div className='w-full space-y-5 xl:w-[40%]'>
                        <div className='flex flex-col'>
                            <h3 className='pb-5 text-xl font-bold'>{t('content.latest_articles')}</h3>
                            <div className='flex w-full flex-col gap-4'>
                                {latestArticles.map((article) => (
                                    <div
                                        key={article.id}
                                        onClick={() => handleArticleClick(article)}
                                        className='group cursor-pointer'>
                                        <LatestArticleCard article={article} basePath={'/news-from-us'} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {initialData?.tags && initialData.tags.length > 0 && (
                            <div className='flex flex-col pt-5'>
                                <h3 className='pb-5 text-xl font-bold'>Tag</h3>
                                <div className='flex flex-wrap gap-2'>
                                    {initialData.tags.map((tag: Tags) => (
                                        <Navigate
                                            key={tag.id}
                                            href={`/news-from-us?category=${tag.name}`}
                                            className='text-primary-500 hover:bg-primary-500 rounded-full border bg-white px-4 py-2 text-xs font-bold transition-all hover:text-white'>
                                            {tag.name}
                                        </Navigate>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Artikel Terkait */}
                <div className='flex flex-col pt-16'>
                    <h3 className='pb-5 text-xl font-bold'>{t('content.related_articles')}</h3>
                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {relatedArticles.map((article, index) => (
                            <div
                                key={article.id}
                                onClick={() => handleArticleClick(article)}
                                className='cursor-pointer'>
                                <ArticleCard article={article} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailNewsClient;
