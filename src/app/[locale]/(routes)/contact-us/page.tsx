'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { apiRequest } from '@/lib/api-request';
import { cn, handleMessageSocialMedia } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { ExternalLink, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { BsTwitterX } from 'react-icons/bs';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { toast } from 'sonner';
import z from 'zod';

const contactSchema = z.object({
    senderType: z.enum(['organization', 'individual']),
    organizationName: z.string().min(2, 'Name is too short').max(100),
    organizationEmail: z.string().email('Invalid email address').max(255),
    subject: z.string().min(5, 'Subject must be at least 5 characters').max(150),
    message: z.string().min(10, 'Message is too short').max(1000),
    agreeToPrivacy: z.boolean().refine((val) => val === true, {
        message: 'You must agree to the privacy policy'
    })
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactUs = () => {
    const t = useTranslations('contact');
    const locale = useLocale();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            senderType: 'organization',
            organizationName: '',
            organizationEmail: '',
            subject: '',
            message: '',
            agreeToPrivacy: false
        }
    });

    const senderType = watch('senderType');
    const agreeToPrivacy = watch('agreeToPrivacy');

    const onSubmit = async (data: ContactFormData) => {
        try {
            const res = await apiRequest.post(API_ENDPOINTS.inquiry, {
                message: data.message,
                email: data.organizationEmail,
                name: data.organizationName,
                subject: data.subject,
                type: data.senderType
            });

            toast.success(res.message ?? 'The form has been successfully sent.');

            reset(
                {
                    senderType: 'organization',
                    organizationName: '',
                    organizationEmail: '',
                    subject: '',
                    message: '',
                    agreeToPrivacy: false
                },
                {
                    keepErrors: false,
                    keepDirty: false,
                    keepTouched: false,
                    keepIsSubmitted: false
                }
            );
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    return (
        <section className='bg-gray-50'>
            <div
                className='relative z-20 h-68 bg-cover bg-center bg-no-repeat pt-8 lg:h-125'
                style={{ backgroundImage: `url('/images/background-contact-us.webp')` }}>
                {/* Overlay */}
                <div className='from-primary-500/80 via-primary-500/80 to-primary-500/20 absolute inset-0 bg-linear-to-b' />

                <div className='z-10 container flex h-full items-center justify-center'>
                    <div className='z-10 flex flex-col items-center justify-center gap-4 lg:gap-6'>
                        <div className='inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-3 py-2 backdrop-blur-sm'>
                            <span className='h-2 w-2 animate-pulse rounded-full bg-orange-500'></span>
                            <p className='text-xs font-medium tracking-wide text-white uppercase'>{t('hero.badge')}</p>
                        </div>
                        {/* Title */}
                        <h2 className='text-3xl font-bold tracking-wide text-white md:text-4xl lg:text-5xl'>
                            {t('hero.title')}
                        </h2>
                        <p className='max-w-3xl text-center text-sm text-white md:text-base lg:text-lg'>
                            {t('hero.description')}
                        </p>
                    </div>
                </div>
            </div>
            <div className='relative z-20 container flex w-full flex-col items-start gap-4 py-16 lg:-mt-30 lg:flex-row'>
                {/* Left Section - Contact Info */}
                <div className='w-full rounded-xl border border-slate-200 bg-white p-8 lg:w-[50%]'>
                    <h2 className='mb-8 text-lg font-bold text-gray-800 lg:text-xl'>{t('info.title')}</h2>

                    {/* Email Section */}
                    <div className='mb-8 flex items-start gap-4'>
                        <div className='text-primary-500 bg-primary-50 border-primary-200 flex h-10 w-10 items-center justify-center rounded-xl border p-2 text-sm font-bold'>
                            <Mail className='h-5 w-5 text-teal-600' />
                        </div>
                        <div>
                            <h3 className='text-base font-semibold text-gray-800'>{t('info.email')}</h3>
                            <p className='text-primary-900 text-sm'>office@infid.org</p>
                            <p className='text-primary-900 text-sm'>pengaduan@infid.org</p>
                        </div>
                    </div>

                    {/* Phone Section */}
                    <div className='mb-8 flex items-start gap-4'>
                        <div className='text-primary-500 bg-primary-50 border-primary-200 flex h-10 w-10 items-center justify-center rounded-xl border p-2 text-sm font-bold'>
                            <Phone className='h-5 w-5 text-teal-600' />
                        </div>
                        <div>
                            <h3 className='text-base font-semibold text-gray-800'>{t('info.contact')}</h3>
                            <p className='text-primary-900 text-sm'>{t('info.phone')} : +62 21 781 9735</p>
                            <p className='text-primary-900 text-sm'>Whatsapp : +6281 1927 7507</p>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className='mb-8 flex items-start gap-4'>
                        <div className='text-primary-500 bg-primary-50 border-primary-200 flex h-10 w-10 items-center justify-center rounded-xl border p-2 text-sm font-bold'>
                            <MapPin className='h-5 w-5 text-teal-600' />
                        </div>
                        <div>
                            <h3 className='text-base font-semibold text-gray-800'>{t('info.address_title')}</h3>
                            <p className='text-primary-900 text-sm'>Jl. Jatipadang Raya Kav.3 No.105</p>
                            <p className='text-primary-900 text-sm'>Pasar Minggu, Jakarta Selatan,</p>
                            <p className='text-primary-900 text-sm'>12540, Indonesia</p>
                            <Button
                                asChild
                                className='text-primary-900 mt-4 rounded-full bg-slate-100 hover:bg-gray-200'>
                                <a
                                    href='https://maps.app.goo.gl/G9y1ZoZoWfBup3B49'
                                    target='_blank'
                                    rel='noopener noreferrer'>
                                    Direction <ExternalLink className='h-4 w-4' />
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className='border-t border-slate-200 pt-8'>
                        <h3 className='mb-4 text-lg font-bold text-gray-800'>{t('info.follow_us')}</h3>
                        <div className='flex gap-4' role='list' aria-label='INFID Social Media Links'>
                            {/* Instagram */}
                            <Link
                                href='https://www.instagram.com/infid_id/'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='group outline-none'
                                role='listitem'>
                                <div className='text-primary-500 border-primary-200 flex h-12 w-12 items-center justify-center rounded-full border transition-all group-hover:bg-teal-600 group-hover:text-white group-focus-visible:ring-2 group-focus-visible:ring-teal-500 group-focus-visible:ring-offset-2'>
                                    <FaInstagram className='h-6 w-6' aria-hidden='true' />
                                    <span className='sr-only'>{handleMessageSocialMedia('Instagram', locale)}</span>
                                </div>
                            </Link>

                            {/* LinkedIn */}
                            <Link
                                href='https://www.linkedin.com/company/infid/'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='group outline-none'
                                role='listitem'>
                                <div className='text-primary-500 border-primary-200 flex h-12 w-12 items-center justify-center rounded-full border transition-all group-hover:bg-teal-600 group-hover:text-white group-focus-visible:ring-2 group-focus-visible:ring-teal-500 group-focus-visible:ring-offset-2'>
                                    <FaLinkedin className='h-6 w-6' aria-hidden='true' />
                                    <span className='sr-only'>{handleMessageSocialMedia('Linkedin', locale)}</span>
                                </div>
                            </Link>

                            {/* YouTube */}
                            <Link
                                href='https://www.youtube.com/@INFIDJakarta'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='group outline-none'
                                role='listitem'>
                                <div className='text-primary-500 border-primary-200 flex h-12 w-12 items-center justify-center rounded-full border transition-all group-hover:bg-teal-600 group-hover:text-white group-focus-visible:ring-2 group-focus-visible:ring-teal-500 group-focus-visible:ring-offset-2'>
                                    <FaYoutube className='h-6 w-6' aria-hidden='true' />
                                    <span className='sr-only'>{handleMessageSocialMedia('Youtube', locale)}</span>
                                </div>
                            </Link>

                            {/* Facebook */}
                            <Link
                                href='https://www.facebook.com/infid'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='group outline-none'
                                role='listitem'>
                                <div className='text-primary-500 border-primary-200 flex h-12 w-12 items-center justify-center rounded-full border transition-all group-hover:bg-teal-600 group-hover:text-white group-focus-visible:ring-2 group-focus-visible:ring-teal-500 group-focus-visible:ring-offset-2'>
                                    <FaFacebook className='h-6 w-6' aria-hidden='true' />
                                    <span className='sr-only'>{handleMessageSocialMedia('Facebook', locale)}</span>
                                </div>
                            </Link>

                            {/* X (Twitter) */}
                            <Link
                                href='https://x.com/infid_ID'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='group outline-none'
                                role='listitem'>
                                <div className='text-primary-500 border-primary-200 flex h-12 w-12 items-center justify-center rounded-full border transition-all group-hover:bg-teal-600 group-hover:text-white group-focus-visible:ring-2 group-focus-visible:ring-teal-500 group-focus-visible:ring-offset-2'>
                                    <BsTwitterX className='h-5 w-5' aria-hidden='true' />
                                    <span className='sr-only'>{handleMessageSocialMedia('X', locale)}</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Section - Contact Form */}
                <div className='w-full rounded-xl border border-slate-200 bg-white p-8'>
                    <h2 className='mb-8 text-lg font-bold text-gray-800 lg:text-xl'>{t('form.title')}</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='bg-muted mb-8 flex w-fit items-center gap-1 rounded-full p-1'>
                            <Button
                                type='button'
                                variant={senderType === 'organization' ? 'default' : null}
                                onClick={() => setValue('senderType', 'organization')}
                                className={cn(
                                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                                    senderType === 'organization'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground bg-transparent'
                                )}>
                                {t('form.tab_org')}
                            </Button>

                            <Button
                                type='button'
                                variant={senderType === 'individual' ? 'default' : null}
                                onClick={() => setValue('senderType', 'individual')}
                                className={cn(
                                    'rounded-full px-4 py-2 text-sm font-medium',
                                    senderType === 'individual'
                                        ? 'bg-primary text-primary-foreground hover:bg-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}>
                                {t('form.tab_ind')}
                            </Button>
                        </div>

                        {/* Form Fields */}
                        <div className='mb-6 grid gap-6 md:grid-cols-2'>
                            <div>
                                <Label htmlFor='organizationName' className='mb-2 block'>
                                    {senderType === 'organization'
                                        ? t('form.label_name_org')
                                        : t('form.label_name_ind')}
                                </Label>
                                <Input
                                    id='organizationName'
                                    {...register('organizationName')}
                                    placeholder={
                                        senderType === 'organization'
                                            ? t('form.placeholder_name_org')
                                            : t('form.placeholder_name_ind')
                                    }
                                />
                                {errors.organizationName && (
                                    <p className='mt-1 text-xs text-red-500'>{errors.organizationName.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor='organizationEmail' className='mb-2 block'>
                                    {senderType === 'organization'
                                        ? t('form.label_email_org')
                                        : t('form.label_email_ind')}
                                </Label>
                                <Input
                                    id='organizationEmail'
                                    type='email'
                                    {...register('organizationEmail')}
                                    placeholder={
                                        senderType === 'organization'
                                            ? t('form.placeholder_email_org')
                                            : t('form.placeholder_email_ind')
                                    }
                                />
                                {errors.organizationEmail && (
                                    <p className='mt-1 text-xs text-red-500'>{errors.organizationEmail.message}</p>
                                )}
                            </div>
                        </div>

                        <div className='mb-6'>
                            <Label htmlFor='subject' className='mb-2 block'>
                                {t('form.label_subject')}
                            </Label>
                            <Input id='subject' {...register('subject')} placeholder={t('form.placeholder_subject')} />
                            {errors.subject && <p className='mt-1 text-xs text-red-500'>{errors.subject.message}</p>}
                        </div>

                        <div className='mb-6'>
                            <Label htmlFor='message' className='mb-2 block'>
                                {t('form.label_message')}
                            </Label>
                            <Textarea
                                id='message'
                                {...register('message')}
                                placeholder={t('form.placeholder_message')}
                                className='h-40 max-h-40 w-full max-w-full resize-none overflow-x-hidden overflow-y-auto'
                            />
                            {errors.message && <p className='mt-1 text-xs text-red-500'>{errors.message.message}</p>}
                        </div>

                        {/* Privacy Checkbox */}
                        <div className='mb-6'>
                            <div className='flex items-center gap-3'>
                                <Checkbox
                                    id='agreeToPrivacy'
                                    checked={agreeToPrivacy === true}
                                    onCheckedChange={(checked) => {
                                        setValue('agreeToPrivacy', checked as true, {
                                            shouldValidate: true
                                        });
                                    }}
                                />
                                <Label
                                    htmlFor='agreeToPrivacy'
                                    className='text-muted-foreground flex-1 text-sm leading-relaxed'>
                                    {t('form.privacy_agreement')}
                                </Label>
                            </div>
                            {errors.agreeToPrivacy && (
                                <p className='mt-1 text-xs text-red-500'>{errors.agreeToPrivacy.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button type='submit' className='w-full rounded-full' disabled={isSubmitting}>
                            {t('form.button_submit')}
                            <Send className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
                        </Button>
                    </form>
                </div>
            </div>
            <iframe
                className='col-span-2 w-full'
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126904.63135160362!2d106.68426574335938!3d-6.293964199999985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3d4915d24af%3A0x7c259138a4087ce8!2sINFID!5e0!3m2!1sen!2sus!4v1776151128429!5m2!1sen!2sus'
                width='600'
                height='450'
                style={{ border: '0' }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'></iframe>
        </section>
    );
};

export default ContactUs;
