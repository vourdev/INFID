import OptimizedImage from '@/components/common/optimized-image';

import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

type ProfileCardProps = {
    name: string;
    title: string;
    image: string;
    onItemClick: () => void;
};

export default function ProfileCard({ name, title, image, onItemClick }: ProfileCardProps) {
    const b = useTranslations('button');

    return (
        <div className='group overflow-hidden rounded-lg border border-slate-200 bg-white p-3 transition-shadow hover:shadow'>
            {/* Image */}
            <div className='relative aspect-square w-full rounded-lg'>
                <OptimizedImage
                    src={image}
                    alt=''
                    aria-hidden='true'
                    fill
                    sizes='(max-width: 768px) 100vw, 256px'
                    placeholderType='square'
                    className='rounded-lg'
                />
            </div>

            {/* Content */}
            <div className='mt-4'>
                <h3 className='decoration-primary-500 -ml-1 rounded-sm px-1 text-sm font-semibold text-gray-900 underline-offset-4 transition-all duration-200'>
                    {name}
                </h3>
                <p className='mt-1 text-sm leading-snug text-gray-600'>{title}</p>
            </div>

            <button
                onClick={onItemClick}
                aria-label={`${b('bioDescription')} ${name}`}
                className='group/btn mt-6 inline-flex cursor-pointer items-center gap-2 border-b border-slate-900 pb-1 text-sm font-semibold outline-none group-focus-within:bg-blue-100 focus-visible:ring-0'>
                {b('bioDescription')}
                <ArrowRight className='h-5 w-5 transition-transform group-hover/btn:translate-x-1' />
            </button>
        </div>
    );
}
