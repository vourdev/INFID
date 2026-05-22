'use client';

import Image from 'next/image';

import { Partners } from '@/types/patner';

import Marquee from 'react-fast-marquee';

interface Props {
    initialData: Partners[] | null;
}

const LogoSection = ({ initialData }: Props) => {
    return (
        <section className='w-full overflow-hidden bg-slate-900 py-8'>
            <div className='xl:px-4'>
                <Marquee pauseOnHover={true} autoFill={true}>
                    {initialData?.map((logo, index) => (
                        <div
                            key={`logo-${index}`}
                            className='mx-10 flex shrink-0 items-center justify-center grayscale transition-all duration-300 hover:grayscale-0'>
                            <Image
                                src={logo.image}
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
