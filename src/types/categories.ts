export const allowedKnowledgeCategories = [
    { id: 'Riset', en: 'Research' },
    { id: 'Kertas Kebijakan', en: 'Policy Paper' },
    { id: 'Artikel', en: 'Articles' },
    { id: 'Riset & Kertas Kebijakan', en: 'Research & Policy Paper' },
    { id: 'Riset', en: 'Research' },
    { id: 'Modul & Panduan', en: 'Modules & Guides' }
];

export const allowedNewsCategories = [
    { id: 'Kegiatan', en: 'Activities' },
    { id: 'Siaran Pers', en: 'Press Release' },
    { id: 'Cerita Perubahan', en: 'Stories of Change' },
    { id: 'Bergerak, Berdampak!', en: 'In Action, Making Impact!' },
    { id: 'Laporan Tahunan', en: 'Annual Report' }
];

export const knowledgeCategorySlugs = [
    'artikel',
    'riset',
    'kertas-kebijakan',
    'modul-panduan'
] as const;

export const newsCategorySlugs = [
    'kegiatan',
    'siaran-pers',
    'cerita-perubahan',
    'laporan-tahunan'
] as const;
