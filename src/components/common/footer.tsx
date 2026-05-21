'use client';

import { useCategories } from '@/context/category-context';
import { subscribeAction } from '@/hooks/subscribe';
import { Link, usePathname } from '@/i18n/routing';
import { cn, handleMessageSocialMedia } from '@/lib/utils';
import { allowedKnowledgeCategories } from '@/types/categories';

import { Input } from '../ui/input';
import SubmitButton from './submit-button';
import { ChevronUp, MailIcon, PhoneCall } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { BsTwitterX, BsWhatsapp } from 'react-icons/bs';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { toast } from 'sonner';

const Footer = () => {
    const pathname = usePathname();
    const t = useTranslations('footer');
    const locale = useLocale();

    const { categories } = useCategories();

    const createCategoryHref = (basePath: string, categoryName: string) => {
        const params = new URLSearchParams();
        params.set('category', categoryName);
        return `${basePath}?${params.toString()}`;
    };

    const footerLinks = {
        about: [
            { name: t('links.structure'), href: '/about/profile-infid' },
            { name: 'INFID Research Fellow', href: '/about/research' },
            { name: t('links.members'), href: '/about/member-infid' },
            { name: t('links.partners'), href: '/about/partner' }
        ],
        advocacy: categories
            .filter((cat) => {
                const catName = cat.name?.find((t) => t.language === locale)?.text || cat.name?.[0]?.text;

                return allowedKnowledgeCategories.some((c) => c.id === catName || c.en === catName);
            })
            .map((cat) => {
                const translatedTitle = cat.name?.find((t) => t.language === locale)?.text || cat.name?.[0]?.text;

                return {
                    name: translatedTitle,
                    href: createCategoryHref('/knowledge', translatedTitle)
                };
            })
    };

    async function handleAction(formData: FormData) {
        const result = await subscribeAction(formData);

        if (result?.error) {
            toast.success(result.error);
        } else {
            toast.success('Success Subscribe');
        }
    }

    return (
        <footer className='bg-primary-500'>
            <div
                className={cn(
                    'container px-4 py-16 md:px-6 xl:px-0',
                    ['/', '/about/member-infid'].includes(pathname) && 'lg:pt-45'
                )}>
                <div className='border-primary-400 grid grid-cols-1 gap-8 border-b pb-9 md:grid-cols-2 lg:grid-cols-12 lg:gap-12'>
                    {/* Brand Column */}
                    <div className='lg:col-span-5'>
                        <div className='mb-6 flex items-center gap-2'>
                            <img
                                width={100}
                                height={100}
                                src='/logo/logo-footer.png'
                                alt='Logo'
                                className='h-10 w-38'
                            />
                        </div>

                        <p className='mb-6 text-sm font-normal text-slate-200'>{t('description')}</p>

                        <div className='flex gap-4' role='list' aria-label='Social media links'>
                            {/* Instagram */}
                            <a
                                href='https://www.instagram.com/infid_id/'
                                target='_blank'
                                rel='noreferrer'
                                role='listitem'
                                className='focus-visible:ring-offset-primary-600 flex items-center justify-center rounded-sm text-white transition-transform outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2'>
                                <FaInstagram className='text-2xl' aria-hidden='true' />
                                <span className='sr-only'>{handleMessageSocialMedia('Instagram', locale)}</span>
                            </a>

                            {/* Linkedin */}
                            <a
                                href='https://www.linkedin.com/company/infid/'
                                target='_blank'
                                rel='noreferrer'
                                role='listitem'
                                className='focus-visible:ring-offset-primary-600 flex items-center justify-center rounded-sm text-white transition-transform outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2'>
                                <FaLinkedin className='text-xl' aria-hidden='true' />
                                <span className='sr-only'>{handleMessageSocialMedia('Linkedin', locale)}</span>
                            </a>

                            {/* Youtube */}
                            <a
                                href='https://www.youtube.com/@INFIDJakarta'
                                target='_blank'
                                rel='noreferrer'
                                role='listitem'
                                className='focus-visible:ring-offset-primary-600 flex items-center justify-center rounded-sm text-white transition-transform outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2'>
                                <FaYoutube className='text-xl' aria-hidden='true' />
                                <span className='sr-only'>{handleMessageSocialMedia('Youtube', locale)}</span>
                            </a>

                            {/* Facebook */}
                            <a
                                href='https://www.facebook.com/infid'
                                target='_blank'
                                rel='noreferrer'
                                role='listitem'
                                className='focus-visible:ring-offset-primary-600 flex items-center justify-center rounded-sm text-white transition-transform outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2'>
                                <FaFacebook className='text-xl' aria-hidden='true' />
                                <span className='sr-only'>{handleMessageSocialMedia('Facebook', locale)}</span>
                            </a>

                            {/* X */}
                            <a
                                href='https://x.com/infid_ID'
                                target='_blank'
                                rel='noreferrer'
                                role='listitem'
                                className='focus-visible:ring-offset-primary-600 flex items-center justify-center rounded-sm text-white transition-transform outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2'>
                                <BsTwitterX className='text-xl' aria-hidden='true' />
                                <span className='sr-only'>{handleMessageSocialMedia('X', locale)}</span>
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className='lg:col-span-7'>
                        <div className='grid grid-cols-2 gap-8 lg:flex'>
                            {Object.entries(footerLinks).map(([category, links]) => (
                                <div key={category} className='lg:w-1/2'>
                                    <h1 className='mb-4 text-base font-bold text-white'>{t(`sections.${category}`)}</h1>

                                    <ul className='flex flex-col gap-4'>
                                        {links.map((link, index) => (
                                            <li key={index} className='flex items-start gap-2'>
                                                {link.name === 'whatsapp' ? (
                                                    <Link
                                                        href={link.href}
                                                        className='flex items-center gap-1 text-sm text-slate-200 hover:text-slate-300'>
                                                        <BsWhatsapp />
                                                        081288881951
                                                    </Link>
                                                ) : link.href !== '' ? (
                                                    <Link
                                                        href={link.href}
                                                        className='text-sm text-slate-200 hover:text-slate-300'>
                                                        {link.name}
                                                    </Link>
                                                ) : (
                                                    <div className='text-sm text-slate-200'>{link.name}</div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            <div className='col-span-2 flex w-full flex-col gap-4 lg:col-span-1 lg:w-fit'>
                                <div className='flex flex-col gap-4'>
                                    <h1 className='text-base font-bold text-white'>{t('sections.newsletter')}</h1>
                                    <p className='text-sm font-normal text-slate-200'>{t('newsletter.description')}</p>
                                </div>

                                <form
                                    className='flex w-full max-w-sm flex-col items-center gap-4'
                                    action={handleAction}>
                                    <Input
                                        name='email'
                                        type='email'
                                        required
                                        placeholder='Masukkan email'
                                        className='rounded-full border-gray-400 bg-white/10 text-sm text-white placeholder:text-slate-400 focus-visible:ring-slate-400'
                                    />

                                    <SubmitButton label='Subscribe' className={''} />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex w-full flex-col items-start justify-between gap-5 md:flex-row md:items-end'>
                    <div className='flex flex-col gap-2 pt-8'>
                        <h1 className='text-base font-bold text-white'>{t('contact.title')}</h1>
                        <p className='text-sm font-normal text-slate-200'>
                            Jl. Jatipadang Raya Kav.3 No.105, Pasar Minggu, Jakarta Selatan, 12540, Indonesia
                        </p>
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center gap-2 text-sm text-white'>
                                <MailIcon className='h-4 w-4' />
                                office@infid.org
                            </div>
                            <div className='flex items-center gap-2 text-sm text-white'>
                                <PhoneCall className='h-4 w-4' />
                                021-7819735
                            </div>
                        </div>
                    </div>
                    <button
                        type='button'
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className='flex cursor-pointer items-center gap-1 text-white transition hover:opacity-80'
                        aria-label={t('backToTop')}>
                        <p className='text-sm font-semibold'>{t('backToTop')}</p>
                        <ChevronUp size={20} />
                    </button>
                </div>
            </div>

            {/* Copyright */}
            <div className='bg-primary-600 w-full'>
                <div className='container flex flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row md:px-6 xl:px-0'>
                    <p className='text-center text-sm text-white md:text-start'>
                        Copyright © {new Date().getFullYear()} by International NGO Forum on Indonesian Development –
                        INFID
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
