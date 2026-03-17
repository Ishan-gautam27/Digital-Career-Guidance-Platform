import axios from 'axios';
const linkedIn = require('linkedin-jobs-api');

// ── Types ───────────────────────────────────────────────────────────────
interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

export interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  tags: string[];
  description: string;
  applyUrl: string;
  postedDate: string;
  isRemote: boolean;
  source: string;
}

// ── Fetchers ────────────────────────────────────────────────────────────

/**
 * Fetch remote jobs from Remotive API (free, no auth)
 * STRICTLY FILTERED FOR INDIA
 */
async function fetchRemotiveJobs(search?: string, category?: string, limit = 100): Promise<NormalizedJob[]> {
  try {
    const params: Record<string, string | number> = { limit };
    if (search) params.search = search;
    if (category) params.category = category;

    const res = await axios.get('https://remotive.com/api/remote-jobs', {
      params,
      timeout: 15000,
    });

    const jobs: RemotiveJob[] = res.data?.jobs || [];
    
    // Filter for India or Worldwide
    const indiaJobs = jobs.filter((j) => {
      const loc = (j.candidate_required_location || '').toLowerCase();
      return loc.includes('india') || loc.includes('worldwide') || loc.includes('global') || loc.includes('anywhere');
    });

    return indiaJobs.map((j) => ({
      id: `remotive-${j.id}`,
      title: j.title,
      company: j.company_name,
      companyLogo: j.company_logo || '',
      location: j.candidate_required_location || 'Remote (India / Global)',
      type: mapJobType(j.job_type),
      salary: j.salary || 'Not disclosed',
      category: j.category || 'Other',
      tags: j.tags || [],
      description: j.description,
      applyUrl: j.url,
      postedDate: j.publication_date,
      isRemote: true,
      source: 'Remotive',
    }));
  } catch (err: any) {
    console.error('[JobsFetcher] Remotive API error:', err.message);
    return [];
  }
}

/**
 * Fetch jobs from LinkedIn Jobs API for India
 */
async function fetchLinkedInJobs(search?: string): Promise<NormalizedJob[]> {
  try {
    const queryOptions = {
        keyword: search || 'software', // Default to software if no search provided
        location: 'India',
        dateSinceLast: 'pastMonth',
        sortMode: 'relevance',
        limit: '50'
    };

    const jobs = await linkedIn.query(queryOptions);
    
    return jobs.map((j: any, index: number) => {
      // Extract stable ID from the LinkedIn URL or fallback to base-64 string
      const jobIdMatch = j.jobUrl?.match(/-(\d+)(\?|$)/);
      const stableId = jobIdMatch ? jobIdMatch[1] : Buffer.from(`${j.company}-${j.position}`).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 15);

      return {
        id: `linkedin-${stableId}-${index}`,
        title: j.position,
        company: j.company,
        companyLogo: j.companyLogo || '',
        location: j.location || 'India',
        type: 'Full-time', // LinkedIn API doesn't return type in generic search
        salary: j.salary && j.salary !== 'Not specified' ? j.salary : 'Not disclosed',
        category: inferCategory([j.position], j.position),
        tags: [],
        description: `Job posting at ${j.company} for ${j.position} in ${j.location}. Click Apply to view full details on LinkedIn.`,
        applyUrl: j.jobUrl,
        postedDate: j.date ? new Date(j.date).toISOString() : new Date().toISOString(),
        isRemote: j.location ? j.location.toLowerCase().includes('remote') : false,
        source: 'LinkedIn',
      };
    });
  } catch (err: any) {
    console.error('[JobsFetcher] LinkedIn API error:', err.message);
    return [];
  }
}

// ── Aggregated fetch ────────────────────────────────────────────────────

export async function fetchAllJobs(search?: string, category?: string): Promise<NormalizedJob[]> {
  const [remotiveJobs, linkedinJobs] = await Promise.all([
    fetchRemotiveJobs(search, category, 100),
    fetchLinkedInJobs(search),
  ]);

  // Combine and sort by posted date (newest first)
  const combined = [...remotiveJobs, ...linkedinJobs];
  combined.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());

  return combined;
}

// ── Helpers ─────────────────────────────────────────────────────────────

function mapJobType(raw: string): string {
  const map: Record<string, string> = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
    freelance: 'Freelance',
    internship: 'Internship',
    other: 'Other',
  };
  return map[raw] || raw || 'Full-time';
}

function inferCategory(tags: string[], title: string): string {
  const combined = [...tags, title].join(' ').toLowerCase();
  if (combined.match(/software|developer|engineer|devops|frontend|backend|fullstack|react|node|python|java/))
    return 'Software Development';
  if (combined.match(/data|analytics|machine learning|ai|ml|scientist/)) return 'Data & Analytics';
  if (combined.match(/design|ux|ui|graphic|creative/)) return 'Design';
  if (combined.match(/market|seo|content|social media|growth/)) return 'Marketing';
  if (combined.match(/product|project|scrum|agile/)) return 'Product & Project Management';
  if (combined.match(/finance|account|banking|trading/)) return 'Finance';
  if (combined.match(/sales|business development|customer/)) return 'Sales & Customer Service';
  if (combined.match(/hr|recruit|people|talent/)) return 'Human Resources';
  if (combined.match(/devops|cloud|infrastructure|sysadmin|security/)) return 'DevOps & Infrastructure';
  return 'Other';
}
