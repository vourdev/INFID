import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { apiRequest } from '@/lib/api-request';
import { Research } from '@/types/research';

import ResearchFellowSection from './_components/research-fellow-section';

async function getInitialResearchFellow() {
    try {
        const res = await apiRequest.get<Research[]>(API_ENDPOINTS.researchFellow, {
            params: {
                limit: 20
            }
        });
        return res.data;
    } catch (err) {
        return [];
    }
}

const ResearchPage = async () => {
    const initialData = await getInitialResearchFellow();
    return (
        <>
            <ResearchFellowSection initialData={initialData} />
        </>
    );
};

export default ResearchPage;
