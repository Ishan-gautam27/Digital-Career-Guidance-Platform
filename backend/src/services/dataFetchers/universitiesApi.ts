import axios from 'axios';

interface UniversityApiResult {
  name: string;
  web_pages: string[];
  domains: string[];
  country: string;
  'state-province': string | null;
  alpha_two_code: string;
}

export interface UniversityData {
  name: string;
  state: string;
  website: string;
  domains: string[];
}

export async function fetchUniversities(): Promise<UniversityData[]> {
  try {
    console.log('[UniversitiesAPI] Fetching Indian universities...');
    const response = await axios.get<UniversityApiResult[]>(
      'http://universities.hipolabs.com/search?country=India',
      { timeout: 30000 }
    );

    const universities: UniversityData[] = response.data.map((uni) => ({
      name: uni.name,
      state: uni['state-province'] || '',
      website: uni.web_pages?.[0] || '',
      domains: uni.domains || [],
    }));

    console.log(`[UniversitiesAPI] Fetched ${universities.length} universities`);
    return universities;
  } catch (error) {
    console.error('[UniversitiesAPI] Error:', error instanceof Error ? error.message : error);
    return [];
  }
}
