'use client';

import { useState } from 'react';

import { ArticleContent } from '@/components/common/article-content';
import EmptyState from '@/components/common/empty-state';
import OptimizedImage from '@/components/common/optimized-image';
import { SectionHeader } from '@/components/common/section-header';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from '@/i18n/navigation';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { apiRequest } from '@/lib/api-request';
import { formatArticleDate, getLangText } from '@/lib/utils';
import { LTPeople, LeadershipTimeline, Publication } from '@/types/leadership-timeline';
import { Post } from '@/types/posts';

import { PeopleGrid } from './people-grid';
import { Eye, MessageSquare } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

const InfidTimeline = ({ initialData }: { initialData: LeadershipTimeline[] }) => {
    const t = useTranslations('profile.timeline_section');
    const locale = useLocale();
    const router = useRouter();

    if (!initialData || initialData.length === 0) {
        return (
            <section className='py-24'>
                <EmptyState className='container mt-0' />
            </section>
        );
    }

    const [activeTimelineId, setActiveTimelineId] = useState<number>(initialData[0].id);
    const [selectedTimeline, setSelectedTimeline] = useState<LeadershipTimeline>(initialData[0]);
    const [selectedPerson, setSelectedPerson] = useState<LTPeople | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const handleTimelineClick = (item: LeadershipTimeline): void => {
        setActiveTimelineId(item.id);
        setSelectedTimeline(item);
    };

    const handlePersonClick = async (person: LTPeople): Promise<void> => {
        const res = await apiRequest.get<LTPeople>(`${API_ENDPOINTS.people}/${person.id}`);
        if (res.status_code == 200) {
            setSelectedPerson(res.data ?? null);
        } else {
            setSelectedPerson(person);
        }

        setDialogOpen(true);
    };

    const handleArticleClick = async (article: Publication) => {
        try {
            await apiRequest.get<Post>(`${API_ENDPOINTS.posts}/${article.id}/view`);
        } catch (error) {
            console.error('Failed to track view:', error);
        }

        router.push(`/knowledge/${article.id}-${article.translations[0]?.slug}`);
    };

    return (
        <section className='from-secondary-100 min-h-screen bg-linear-to-b to-transparent pt-24' id='history-infid'>
            <div className='container'>
                <SectionHeader
                    badge={t('header.badge')}
                    badgeProps={{
                        textColor: 'text-slate-500',
                        lineColor: 'bg-primary-400'
                    }}
                    title={t('header.title')}
                    description={t('header.description')}
                    titleClassName='text-primary-900'
                    descriptionClassName='text-primary-700 max-w-4xl'
                />

                {/* Timeline Navigation */}
                <div className='mb-16'>
                    <div className='relative'>
                        <div className='absolute top-6 right-0 left-0 h-0.5 bg-gray-300' />
                        <div className='scrollbar-hide flex justify-start gap-6 overflow-x-auto px-2 pb-4'>
                            {initialData.map((item, index) => {
                                const isActive = item.id === activeTimelineId;
                                return (
                                    <div
                                        key={item.id}
                                        className='flex w-32 shrink-0 cursor-pointer flex-col items-center'
                                        onClick={() => handleTimelineClick(item)}>
                                        <div className='relative z-10 flex h-12 items-center'>
                                            <div
                                                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white font-bold transition-all ${
                                                    isActive
                                                        ? 'text-primary-600 border-teal-600 shadow'
                                                        : 'text-primary-400 border-gray-300'
                                                }`}>
                                                {index + 1}
                                            </div>
                                        </div>
                                        <p
                                            className={`mt-4 text-center text-sm leading-snug ${isActive ? 'text-primary-500 font-semibold' : 'text-slate-900'}`}>
                                            {getLangText(item.title, locale) || ''}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className='mt-8'>
                    <div className='max-w-full xl:max-w-4xl'>
                        <h2 className='text-primary-500 mb-6 text-2xl font-bold'>
                            {selectedTimeline.title?.find((d) => d.language === locale)?.text ||
                                selectedTimeline.title?.[0]?.text ||
                                ''}
                        </h2>
                        <div className='flex flex-col items-start gap-8 md:flex-row'>
                            <div className='flex w-full flex-col gap-2 md:w-1/3'>
                                {selectedTimeline.images.map((item, index) => (
                                    <img
                                        src={item}
                                        alt='People'
                                        key={index}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/placeholder-square.png';
                                        }}
                                    />
                                ))}
                            </div>
                            <div className='w-full md:w-3/4'>
                                <ArticleContent
                                    content={
                                        selectedTimeline.description?.find((d) => d.language === locale)?.text ||
                                        selectedTimeline.description?.[0]?.text ||
                                        ''
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    {selectedTimeline.people && selectedTimeline.people.length > 0 && (
                        <PeopleGrid
                            title={getLangText(selectedTimeline.title, locale) || ''}
                            data={selectedTimeline.people}
                            onItemClick={handlePersonClick}
                            hideTitle={selectedTimeline.people.length < 0}
                            className={selectedTimeline.people.length > 0 ? 'py-8' : ''}
                        />
                    )}
                </div>

                {/* Profile Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl'>
                        {selectedPerson && (
                            <>
                                <DialogHeader>
                                    <DialogTitle className='text-start font-bold text-gray-900'>
                                        Profil {getLangText(selectedTimeline.title, locale) || ''}
                                    </DialogTitle>
                                    <DialogDescription></DialogDescription>
                                </DialogHeader>

                                <div className='mt-4 flex flex-col items-center gap-6 md:flex-row md:items-start'>
                                    <div className='relative h-64 w-64 shrink-0 overflow-hidden rounded-xl border bg-slate-100'>
                                        <OptimizedImage
                                            src={selectedPerson.image ?? ''}
                                            alt={selectedPerson.name}
                                            fill
                                            sizes='100%'
                                            placeholderType='square'
                                        />
                                    </div>
                                    <div className='flex flex-1 flex-col items-center text-center md:items-start md:text-left'>
                                        <h3 className='text-2xl font-bold text-gray-900'>{selectedPerson.name}</h3>
                                        <p className='text-primary-500 text-sm font-medium'>
                                            {selectedPerson.occupation}
                                        </p>
                                        <div className='prose prose-sm mt-4 text-slate-700'>
                                            {selectedPerson.description || 'No detailed information available.'}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {selectedPerson?.publications && selectedPerson.publications.length > 0 && (
                            <div className='mt-8 flex flex-col'>
                                <h4 className='mb-4 border-t pt-6 text-lg font-bold text-gray-900'>
                                    {locale === 'id' ? 'Publikasi Terbaru' : 'Latest Publications'}
                                </h4>

                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                    {selectedPerson.publications.map((pub: Publication, index) => {
                                        const translation =
                                            pub?.translations?.find((t) => t.language === locale) ||
                                            pub?.translations?.find((t) => t.language === 'id') ||
                                            pub?.translations?.[0];
                                        return (
                                            <div
                                                onClick={() => handleArticleClick(pub)}
                                                key={index}
                                                className='group flex cursor-pointer gap-4'>
                                                <div className='h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100'>
                                                    <img
                                                        src={pub?.cover ?? ''}
                                                        alt={getLangText(selectedTimeline.title, locale) || ''}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src =
                                                                '/images/placeholder-square.png';
                                                        }}
                                                        className='h-full w-full object-cover transition-transform group-hover:scale-110'
                                                    />
                                                </div>

                                                <div className='flex flex-col justify-between py-1'>
                                                    <div>
                                                        <div className='text-secondary-200 flex items-center gap-2 text-[10px] font-semibold tracking-wider uppercase'>
                                                            {selectedPerson.occupation}
                                                            <span className='text-slate-300'>•</span>
                                                            <span className='font-normal text-slate-500'>
                                                                {pub.created_at
                                                                    ? formatArticleDate(pub.created_at)
                                                                    : 'No Date'}
                                                            </span>
                                                        </div>
                                                        <h5 className='group-hover:text-primary-500 mt-1 line-clamp-2 text-sm leading-snug font-bold text-slate-900'>
                                                            {translation.title}
                                                        </h5>
                                                    </div>

                                                    <div className='mt-2 flex items-center gap-4 text-[11px] text-slate-400'>
                                                        <div className='flex items-center gap-1'>
                                                            <Eye size={14} />
                                                            {pub?.views ?? 0} {locale === 'id' ? 'Dilihat' : 'Views'}
                                                        </div>
                                                        <div className='flex items-center gap-1'>
                                                            <MessageSquare size={14} />
                                                            {pub?.comments.length ?? 0}{' '}
                                                            {locale === 'id' ? 'Komentar' : 'Comments'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Background Decoration */}
            <div
                className='from-secondary-100 relative mt-12 h-115.5 bg-linear-to-t to-transparent'
                style={{
                    backgroundImage: `url('/images/timeline.webp'), linear-gradient(180deg, #FAF5E3 0%, rgba(250, 245, 227, 0) 100%)`,
                    backgroundBlendMode: 'overlay',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
        </section>
    );
};

export default InfidTimeline;
