import axios from 'axios';

export interface OpenAlexInstitution {
  name: string;
  city: string;
  state: string;
  country: string;
  website: string;
  openAlexId: string;
  citedByCount: number;
  worksCount: number;
  hIndex: number;
  topics: string[];
  type: string;
}

interface OpenAlexResponse {
  meta: { count: number; page: number; per_page: number };
  results: OpenAlexResult[];
}

interface OpenAlexResult {
  id: string;
  display_name: string;
  country_code: string;
  type: string;
  homepage_url: string;
  cited_by_count: number;
  works_count: number;
  summary_stats: { h_index: number };
  geo: { city: string; region: string | null; country: string };
  topics: { display_name: string }[];
}

export async function fetchOpenAlexInstitutions(): Promise<OpenAlexInstitution[]> {
  const institutions: OpenAlexInstitution[] = [];
  const perPage = 200;
  let page = 1;
  const maxPages = 10; // Limit to 2000 institutions to avoid overload

  try {
    console.log('[OpenAlex] Fetching Indian institutions...');

    while (page <= maxPages) {
      const response = await axios.get<OpenAlexResponse>(
        `https://api.openalex.org/institutions?filter=country_code:IN&per_page=${perPage}&page=${page}`,
        { timeout: 30000 }
      );

      const results = response.data.results;
      if (!results || results.length === 0) break;

      for (const inst of results) {
        institutions.push({
          name: inst.display_name,
          city: inst.geo?.city || '',
          state: inst.geo?.region || '',
          country: inst.geo?.country || 'India',
          website: inst.homepage_url || '',
          openAlexId: inst.id,
          citedByCount: inst.cited_by_count || 0,
          worksCount: inst.works_count || 0,
          hIndex: inst.summary_stats?.h_index || 0,
          topics: (inst.topics || []).slice(0, 10).map((t) => t.display_name),
          type: inst.type || 'education',
        });
      }

      if (results.length < perPage) break;
      page++;

      // Be polite — small delay between pages
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`[OpenAlex] Fetched ${institutions.length} institutions`);
    return institutions;
  } catch (error) {
    console.error('[OpenAlex] Error:', error instanceof Error ? error.message : error);
    return institutions; // Return whatever we got so far
  }
}
