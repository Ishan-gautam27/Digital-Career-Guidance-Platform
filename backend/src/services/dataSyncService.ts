import College from '../models/College';
import { fetchUniversities } from './dataFetchers/universitiesApi';
import { fetchOpenAlexInstitutions } from './dataFetchers/openAlexApi';
import { fetchIndianColleges } from './dataFetchers/indianCollegesApi';
import { scrapeNirfRankings } from './dataFetchers/nirfScraper';
import { scrapeMultipleColleges } from './dataFetchers/collegeScraper';

function normalizeCollegeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function classifyType(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('institute') || lower.includes('iit') || lower.includes('nit') || lower.includes('iiit')) return 'institute';
  if (lower.includes('college')) return 'college';
  if (lower.includes('university') || lower.includes('vidyapith') || lower.includes('vidyapeeth')) return 'university';
  return 'other';
}

export async function syncAllData(): Promise<{ totalColleges: number; newColleges: number; updatedColleges: number }> {
  console.log('[DataSync] Starting full data synchronization...');
  const startTime = Date.now();

  let newCount = 0;
  let updateCount = 0;

  // Step 1: Fetch from all APIs concurrently
  const [universities, openAlexInstitutions, indianColleges] = await Promise.all([
    fetchUniversities(),
    fetchOpenAlexInstitutions(),
    fetchIndianColleges(),
  ]);

  // Step 2: Scrape NIRF rankings
  const nirfRankings = await scrapeNirfRankings();

  // Build NIRF lookup by normalized name
  const nirfLookup = new Map<string, { rank: number; score: number; year: number; category: string }>();
  for (const ranking of nirfRankings) {
    const key = normalizeCollegeName(ranking.collegeName);
    if (!nirfLookup.has(key) || ranking.category === 'Overall') {
      nirfLookup.set(key, {
        rank: ranking.rank,
        score: ranking.score,
        year: ranking.year,
        category: ranking.category,
      });
    }
  }

  // Step 3: Upsert universities from hipolabs
  for (const uni of universities) {
    try {
      const existing = await College.findOne({ name: uni.name });
      const nirfData = nirfLookup.get(normalizeCollegeName(uni.name));

      const updateData: any = {
        name: uni.name,
        state: uni.state || existing?.state || '',
        website: uni.website || existing?.website || '',
        type: classifyType(uni.name),
        domains: uni.domains || [],
        lastUpdated: new Date(),
        $addToSet: { sources: 'universities-api' },
      };

      if (nirfData) {
        updateData.nirfRanking = nirfData;
      }

      const result = await College.findOneAndUpdate(
        { name: uni.name },
        updateData,
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
      updateCount++;
    } catch {
      // Skip errors for individual entries
    }
  }

  // Step 4: Merge OpenAlex data
  for (const inst of openAlexInstitutions) {
    try {
      const nirfData = nirfLookup.get(normalizeCollegeName(inst.name));
      const updateData: any = {
        name: inst.name,
        city: inst.city || '',
        state: inst.state || '',
        website: inst.website || '',
        type: classifyType(inst.name),
        openAlexData: {
          openAlexId: inst.openAlexId,
          citedByCount: inst.citedByCount,
          worksCount: inst.worksCount,
          hIndex: inst.hIndex,
          topics: inst.topics,
        },
        lastUpdated: new Date(),
        $addToSet: { sources: 'openalex' },
      };

      if (nirfData) {
        updateData.nirfRanking = nirfData;
      }

      const result = await College.findOneAndUpdate(
        { name: inst.name },
        updateData,
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
      updateCount++;
    } catch {
      // Skip errors
    }
  }

  // Step 5: Merge Indian Colleges API data
  for (const college of indianColleges) {
    try {
      const nirfData = nirfLookup.get(normalizeCollegeName(college.name));
      const updateData: any = {
        name: college.name,
        state: college.state || '',
        city: college.city || '',
        type: college.type || classifyType(college.name),
        lastUpdated: new Date(),
        $addToSet: { sources: 'indian-colleges-api' },
      };

      if (college.courses.length > 0) {
        updateData.$addToSet.courses = { $each: college.courses };
      }
      if (nirfData) {
        updateData.nirfRanking = nirfData;
      }

      const result = await College.findOneAndUpdate(
        { name: college.name },
        updateData,
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
      updateCount++;
    } catch {
      // Skip errors
    }
  }

  // Step 6: Scrape college websites for top colleges (limit to top 50 with websites)
  const topColleges = await College.find({ website: { $ne: '' } })
    .sort({ 'nirfRanking.rank': 1 })
    .limit(50)
    .select('name website')
    .lean();

  if (topColleges.length > 0) {
    const scrapedData = await scrapeMultipleColleges(
      topColleges.map((c) => ({ name: c.name, website: c.website }))
    );

    for (const [name, data] of scrapedData) {
      try {
        const updateData: any = { lastUpdated: new Date() };
        if (data.courses.length > 0) {
          updateData.$addToSet = { courses: { $each: data.courses } };
        }
        if (data.feesRange.min > 0 || data.feesRange.max > 0) {
          updateData.feesRange = { ...data.feesRange, currency: 'INR' };
        }
        if (data.admissionDetails) {
          updateData.admissionDetails = data.admissionDetails;
        }
        if (data.placementStats.averagePackage || data.placementStats.topRecruiters.length > 0) {
          updateData.placementStats = data.placementStats;
        }

        await College.findOneAndUpdate({ name }, updateData);
      } catch {
        // Skip errors
      }
    }
  }

  const totalColleges = await College.countDocuments();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[DataSync] Complete! ${totalColleges} total colleges (${newCount} new, ${updateCount} updated) in ${elapsed}s`);

  return { totalColleges, newColleges: newCount, updatedColleges: updateCount };
}
