'use client';

import Image from 'next/image';

import { Partners } from '@/types/patner';

import Marquee from 'react-fast-marquee';

interface Props {
    initialData: Partners[] | null;
}

const LogoSection = ({ initialData }: Props) => {
    const logos = [
        { name: 'Partner 1', icon: '/images/patner-1.png' },
        { name: 'Ford Foundation', icon: '/images/patner-2.png' },
        { name: 'Global Center', icon: '/images/patner-3.png' },
        { name: 'USAID', icon: '/images/patner-4.png' },
        { name: 'GIZ', icon: '/images/patner-5.png' },
        { name: 'UNDP', icon: '/images/patner-6.png' },
        { name: 'EU', icon: '/images/patner-7.png' },
        { name: 'Partner 8', icon: '/images/patner-8.png' }
    ];

    return (
        <section className='w-full overflow-hidden bg-slate-900 py-8'>
            <div className='xl:px-4'>
                <Marquee pauseOnHover={true} autoFill={true}>
                    {logos.map((logo, index) => (
                        <div
                            key={`logo-${index}`}
                            className='mx-10 flex shrink-0 items-center justify-center grayscale transition-all duration-300 hover:grayscale-0'>
                            <Image
                                src={logo.icon}
                                alt={logo.name ?? 'logo'}
                                width={120}
                                height={60}
                                className='h-8 w-auto object-contain opacity-90'
                            />
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
};

export default LogoSection;
