import axios from 'axios';
import * as cheerio from 'cheerio';
import NirfRanking from '../../models/NirfRanking';

interface NirfEntry {
  collegeName: string;
  rank: number;
  score: number;
  city: string;
  state: string;
  category: string;
  year: number;
}

const NIRF_CATEGORIES = [
  { name: 'Overall', slug: 'overall' },
  { name: 'Engineering', slug: 'engineering' },
  { name: 'Management', slug: 'management' },
  { name: 'University', slug: 'university' },
  { name: 'College', slug: 'college' },
  { name: 'Medical', slug: 'medical' },
  { name: 'Pharmacy', slug: 'pharmacy' },
  { name: 'Law', slug: 'law' },
  { name: 'Architecture', slug: 'architecture' },
];

async function scrapeNirfCategory(category: string, slug: string, year: number): Promise<NirfEntry[]> {
  const entries: NirfEntry[] = [];

  try {
    // NIRF publishes rankings on pages like /rankings/{year}/{slug}Ranking
    const urls = [
      `https://www.nirfindia.org/${year}/${slug}Ranking.html`,
      `https://www.nirfindia.org/${year}/Ranking.html`,
      `https://www.nirfindia.org/Rankings/${year}/${slug}`,
    ];

    let html = '';
    for (const url of urls) {
      try {
        const response = await axios.get(url, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; CollegeDataBot/1.0)',
          },
        });
        if (response.data && typeof response.data === 'string') {
          html = response.data;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!html) return entries;

    const $ = cheerio.load(html);

    // NIRF tables typically have rows with rank, institution name, city, state, score
    $('table tr, .ranking-table tr, #tbl_overall tr, #tbl_engg tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 3) {
        const rankText = $(cells[0]).text().trim();
        const rank = parseInt(rankText, 10);
        if (isNaN(rank) || rank <= 0) return;

        const name = $(cells[1]).text().trim();
        if (!name) return;

        // Try to extract city/state — often in the same cell or separate cells
        let city = '';
        let state = '';
        let score = 0;

        if (cells.length >= 4) {
          const locationText = $(cells[2]).text().trim();
          const parts = locationText.split(',').map((p: string) => p.trim());
          city = parts[0] || '';
          state = parts[1] || '';
          score = parseFloat($(cells[3]).text().trim()) || 0;
        } else {
          score = parseFloat($(cells[2]).text().trim()) || 0;
        }

        entries.push({
          collegeName: name,
          rank,
          score,
          city,
          state,
          category,
          year,
        });
      }
    });
  } catch (error) {
    console.error(`[NIRF] Error scraping ${category}:`, error instanceof Error ? error.message : error);
  }

  return entries;
}

export async function scrapeNirfRankings(year?: number): Promise<NirfEntry[]> {
  const targetYear = year || new Date().getFullYear();
  const allEntries: NirfEntry[] = [];

  console.log(`[NIRF] Scraping rankings for year ${targetYear}...`);

  for (const cat of NIRF_CATEGORIES) {
    const entries = await scrapeNirfCategory(cat.name, cat.slug, targetYear);
    allEntries.push(...entries);
    // Be polite
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Also try previous year if current year has no data
  if (allEntries.length === 0 && !year) {
    console.log(`[NIRF] No data for ${targetYear}, trying ${targetYear - 1}...`);
    for (const cat of NIRF_CATEGORIES) {
      const entries = await scrapeNirfCategory(cat.name, cat.slug, targetYear - 1);
      allEntries.push(...entries);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Save to database
  if (allEntries.length > 0) {
    console.log(`[NIRF] Saving ${allEntries.length} ranking entries...`);
    for (const entry of allEntries) {
      try {
        await NirfRanking.findOneAndUpdate(
          { collegeName: entry.collegeName, year: entry.year, category: entry.category },
          entry,
          { upsert: true, returnDocument: 'after' }
        );
      } catch {
        // Skip duplicate errors
      }
    }
  }

  console.log(`[NIRF] Scraped ${allEntries.length} rankings`);
  return allEntries;
}
