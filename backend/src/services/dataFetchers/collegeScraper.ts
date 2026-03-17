import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedCollegeData {
  courses: string[];
  feesRange: { min: number; max: number };
  admissionDetails: string;
  placementStats: {
    averagePackage: string;
    highestPackage: string;
    placementRate: string;
    topRecruiters: string[];
  };
}

const COURSE_KEYWORDS = [
  'B.Tech', 'M.Tech', 'B.E.', 'M.E.', 'BBA', 'MBA', 'BCA', 'MCA',
  'B.Sc', 'M.Sc', 'B.Com', 'M.Com', 'B.A.', 'M.A.', 'B.Pharm', 'M.Pharm',
  'MBBS', 'BDS', 'LLB', 'LLM', 'B.Arch', 'M.Arch', 'PhD', 'Ph.D',
  'B.Ed', 'M.Ed', 'Diploma', 'Certificate', 'BMS', 'B.Des', 'M.Des',
  'Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics',
  'Information Technology', 'Chemical', 'Biotechnology', 'Aerospace',
];

const FEE_PATTERNS = [
  /(?:fee|fees|tuition)\s*[:\-]?\s*(?:Rs\.?|INR|₹)\s*([\d,]+)/gi,
  /(?:Rs\.?|INR|₹)\s*([\d,]+)\s*(?:per\s*(?:year|annum|semester))/gi,
  /([\d,]+)\s*(?:per\s*(?:year|annum|semester))/gi,
];

function extractCourses(text: string): string[] {
  const found = new Set<string>();
  for (const keyword of COURSE_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword.replace(/\./g, '\\.?')}\\b`, 'gi');
    if (regex.test(text)) {
      found.add(keyword);
    }
  }
  return Array.from(found);
}

function extractFees(text: string): { min: number; max: number } {
  const amounts: number[] = [];
  for (const pattern of FEE_PATTERNS) {
    let match;
    const re = new RegExp(pattern.source, pattern.flags);
    while ((match = re.exec(text)) !== null) {
      const amount = parseInt(match[1].replace(/,/g, ''), 10);
      if (amount > 0 && amount < 100000000) {
        amounts.push(amount);
      }
    }
  }
  if (amounts.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...amounts), max: Math.max(...amounts) };
}

function extractAdmissionDetails(text: string): string {
  const admissionKeywords = ['admission', 'eligibility', 'entrance exam', 'application', 'apply'];
  const sentences = text.split(/[.!?\n]+/);
  const relevant = sentences
    .filter((s) => admissionKeywords.some((k) => s.toLowerCase().includes(k)))
    .slice(0, 5)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 500);

  return relevant.join('. ').substring(0, 1000) || '';
}

function extractPlacementStats(text: string): ScrapedCollegeData['placementStats'] {
  const stats = {
    averagePackage: '',
    highestPackage: '',
    placementRate: '',
    topRecruiters: [] as string[],
  };

  // Average package
  const avgMatch = text.match(/(?:average|avg|mean)\s*(?:package|salary|ctc)[:\s]*(?:Rs\.?|INR|₹)?\s*([\d,.]+\s*(?:LPA|lakhs?|crores?|lakh)?)/i);
  if (avgMatch) stats.averagePackage = avgMatch[1].trim();

  // Highest package
  const highMatch = text.match(/(?:highest|maximum|max|top)\s*(?:package|salary|ctc)[:\s]*(?:Rs\.?|INR|₹)?\s*([\d,.]+\s*(?:LPA|lakhs?|crores?|lakh)?)/i);
  if (highMatch) stats.highestPackage = highMatch[1].trim();

  // Placement rate
  const rateMatch = text.match(/(?:placement|placed)\s*(?:rate|percentage)?[:\s]*([\d.]+)\s*%/i);
  if (rateMatch) stats.placementRate = `${rateMatch[1]}%`;

  // Top recruiters
  const recruiterCompanies = [
    'Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Cognizant',
    'HCL', 'Deloitte', 'Accenture', 'IBM', 'Capgemini', 'Tech Mahindra',
    'L&T', 'Flipkart', 'Paytm', 'Zomato', 'Swiggy', 'Reliance', 'HDFC',
    'ICICI', 'Goldman Sachs', 'JP Morgan', 'Samsung', 'Intel', 'Qualcomm',
    'Adobe', 'Oracle', 'SAP', 'Cisco', 'Uber', 'Meta', 'Apple',
  ];
  for (const company of recruiterCompanies) {
    if (text.toLowerCase().includes(company.toLowerCase())) {
      stats.topRecruiters.push(company);
    }
  }
  stats.topRecruiters = stats.topRecruiters.slice(0, 15);

  return stats;
}

export async function scrapeCollegeWebsite(url: string): Promise<ScrapedCollegeData> {
  const defaultData: ScrapedCollegeData = {
    courses: [],
    feesRange: { min: 0, max: 0 },
    admissionDetails: '',
    placementStats: {
      averagePackage: '',
      highestPackage: '',
      placementRate: '',
      topRecruiters: [],
    },
  };

  if (!url || !url.startsWith('http')) return defaultData;

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CollegeDataBot/1.0)',
      },
      maxRedirects: 3,
    });

    if (typeof response.data !== 'string') return defaultData;

    const $ = cheerio.load(response.data);

    // Remove scripts and styles
    $('script, style, nav, footer, header').remove();
    const text = $('body').text().replace(/\s+/g, ' ');

    return {
      courses: extractCourses(text),
      feesRange: extractFees(text),
      admissionDetails: extractAdmissionDetails(text),
      placementStats: extractPlacementStats(text),
    };
  } catch {
    return defaultData;
  }
}

export async function scrapeMultipleColleges(
  colleges: { name: string; website: string }[]
): Promise<Map<string, ScrapedCollegeData>> {
  const results = new Map<string, ScrapedCollegeData>();
  const batchSize = 5;

  console.log(`[CollegeScraper] Scraping ${colleges.length} college websites...`);

  for (let i = 0; i < colleges.length; i += batchSize) {
    const batch = colleges.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map((c) => scrapeCollegeWebsite(c.website))
    );

    batchResults.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        results.set(batch[idx].name, result.value);
      }
    });

    // Rate limiting
    if (i + batchSize < colleges.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log(`[CollegeScraper] Scraped ${results.size} college websites`);
  return results;
}
