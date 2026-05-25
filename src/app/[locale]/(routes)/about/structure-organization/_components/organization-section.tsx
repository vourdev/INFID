'use client';
import { useState } from 'react';

import OptimizedImage from '@/components/common/optimized-image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { apiRequest } from '@/lib/api-request';
import { formatLabel } from '@/lib/utils';
import { OrganizationPeople, OrganizationPublication, OrganizationStructureProps, Person } from '@/types/organization';

import { Eye, MessageSquare } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function OrganizationStructure({ data, activeTitle }: OrganizationStructureProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const locale = useLocale();

    const handleOpenDialog = async (person: OrganizationPeople) => {
        const res = await apiRequest.get<Person>(`${API_ENDPOINTS.people}/${person.id}`);
        if (res.status_code == 200) {
            setSelectedPerson(res.data);
        } else {
            setSelectedPerson(null);
        }
        setDialogOpen(true);
    };

    return (
        <div className='py-20'>
            <div className='container text-center'>
                <h2 className='text-primary-500 mb-8 text-3xl font-bold md:text-4xl'>{formatLabel(activeTitle)}</h2>

                <div className='relative flex flex-col items-center'>
                    <div className='flex w-full flex-col items-center'>
                        <div className='flex flex-wrap justify-center gap-6'>
                            {data.map((person: OrganizationPeople) => (
                                <div key={person.id} className='flex max-w-55 shrink-0 grow-0 basis-55 justify-center'>
                                    <MemberCard
                                        name={person.name}
                                        role={person.occupation}
                                        image={person.image ?? ''}
                                        onClick={() => handleOpenDialog(person)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl'>
                    {selectedPerson && (
                        <>
                            <DialogHeader>
                                <DialogTitle className='sr-only'>{selectedPerson.name}</DialogTitle>
                                <DialogDescription className='sr-only'>
                                    Detail profile {selectedPerson.name}
                                </DialogDescription>
                            </DialogHeader>

                            <div className='flex flex-col items-center gap-5 md:flex-row md:items-start'>
                                <div className='mb-4 h-60 w-60 shrink-0 overflow-hidden rounded-lg bg-slate-100'>
                                    <img
                                        src={selectedPerson.image || '/images/placeholder-square.png'}
                                        alt={selectedPerson.name}
                                        className='h-full w-full object-cover'
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/placeholder-square.png';
                                        }}
                                    />
                                </div>
                                <div className='flex flex-1 flex-col items-center md:items-start'>
                                    <h3 className='text-2xl font-bold text-gray-900'>{selectedPerson.name}</h3>
                                    <p className='text-primary-500 text-sm font-medium'>{selectedPerson.occupation}</p>

                                    <p className='mt-4 text-center leading-relaxed text-gray-700 md:text-left'>
                                        {selectedPerson.address || 'No profile address.'}
                                    </p>

                                    {(selectedPerson.email || selectedPerson.phone) && (
                                        <div className='mt-4 flex flex-col gap-1 text-sm text-slate-500'>
                                            {selectedPerson.email && <span>Email: {selectedPerson.email}</span>}
                                            {selectedPerson.phone && <span>Telp: {selectedPerson.phone}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedPerson.publications && selectedPerson.publications.length > 0 && (
                                <div className='mt-8 flex flex-col'>
                                    <h4 className='mb-4 border-t pt-6 text-lg font-bold text-gray-900'>
                                        {locale === 'id' ? 'Publikasi Terbaru' : 'Latest Publications'}
                                    </h4>
                                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                        {selectedPerson.publications.map((pub: OrganizationPublication) => (
                                            <div key={pub.id} className='group flex cursor-pointer gap-4'>
                                                <div className='h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100'>
                                                    <img
                                                        src={pub.image}
                                                        alt={pub.title}
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
                                                            {pub.category}
                                                            <span className='text-slate-300'>•</span>
                                                            <span className='font-normal text-slate-500'>
                                                                {pub.date}
                                                            </span>
                                                        </div>
                                                        <h5 className='group-hover:text-primary-500 mt-1 line-clamp-2 text-sm leading-snug font-bold text-slate-900'>
                                                            {pub.title}
                                                        </h5>
                                                    </div>

                                                    <div className='mt-2 flex items-center gap-4 text-[11px] text-slate-400'>
                                                        <div className='flex items-center gap-1'>
                                                            <Eye size={14} /> {pub.views}{' '}
                                                            {locale == 'id' ? 'Dilihat' : 'Seen'}
                                                        </div>
                                                        <div className='flex items-center gap-1'>
                                                            <MessageSquare size={14} /> {pub.comments}{' '}
                                                            {locale == 'id' ? 'Komentar' : 'Comments'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function MemberCard({
    name,
    role,
    image,
    onClick
}: {
    name: string;
    role: string;
    image: string;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className='group cursor-pointer rounded-lg border border-slate-200 bg-white p-3 transition-shadow duration-300 ease-in-out hover:shadow'>
            <div className='relative mb-4 aspect-square h-50 w-full overflow-hidden rounded-lg'>
                <OptimizedImage src={image} alt={name} fill placeholderType='square' className='object-cover' />
            </div>
            <h3 className='text-center font-bold text-slate-900'>{name}</h3>
            <p className='text-primary-500 mb-2 max-w-75 text-center text-sm font-medium'>{role}</p>
        </div>
    );
}
