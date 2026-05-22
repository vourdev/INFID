import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { apiRequest } from '@/lib/api-request';
import { Partners } from '@/types/patner';
import { Post } from '@/types/posts';

import AboutUsSection from './_components/about-us-section';
import Home from './_components/home-section';
import LogoSection from './_components/logo-section';
import OurNetworkSection from './_components/our-network-section';
import ProgramSection from './_components/program-section';
import PublicationsSection from './_components/publications-section';
import RealImpactSection from './_components/real-impact-section';
import RecognitionSection from './_components/recognition-section';

async function getInitialPublications() {
    try {
        const res = await apiRequest.get<Post[]>(API_ENDPOINTS.posts, {
            params: {
                category: 'Kegiatan',
                search: '',
                author: '',
                tags: '',
                year: '',
                random: '',
                limit: ''
            }
        });
        return res.data.filter((item) => item.status.toLowerCase() == 'published') || [];
    } catch (err) {
        return [];
    }
}

async function getPatner() {
    try {
        const res = await apiRequest.get<Partners[]>(API_ENDPOINTS.partners, {
            params: {
                is_donor: true
            }
        });
        return res.data || [];
    } catch (error) {
        console.error('Fetch Patner Error:', error);
        return null;
    }
}

const HomePage = async () => {
    const programData = await getInitialPublications();
    const partnerData = await getPatner();

    return (
        <>
            <Home />
            <LogoSection initialData={partnerData} />
            <AboutUsSection />
            <RealImpactSection programData={programData} />
            <PublicationsSection />
            <ProgramSection />
            <OurNetworkSection />
            <RecognitionSection />
        </>
    );
};

export default HomePage;
