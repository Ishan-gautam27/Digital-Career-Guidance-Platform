import { Request, Response } from 'express';
import { fetchAllJobs, NormalizedJob } from '../services/dataFetchers/jobsFetcher';

// In-memory cache to avoid hammering APIs on every request
let cachedJobs: NormalizedJob[] = [];
let lastFetchTime = 0;
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

async function getJobs(): Promise<NormalizedJob[]> {
  const now = Date.now();
  if (cachedJobs.length > 0 && now - lastFetchTime < CACHE_DURATION_MS) {
    return cachedJobs;
  }
  cachedJobs = await fetchAllJobs();
  lastFetchTime = now;
  return cachedJobs;
}

/**
 * GET /api/jobs/search
 * Query params: q, category, type, remote, page, limit
 */
export async function searchJobs(req: Request, res: Response) {
  try {
    const allJobs = await getJobs();

    const q = (req.query.q as string || '').toLowerCase();
    const category = req.query.category as string;
    const type = req.query.type as string;
    const remote = req.query.remote as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    let filtered = allJobs;

    if (q) {
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q)) ||
          j.category.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter((j) => j.category === category);
    }

    if (type && type !== 'all') {
      filtered = filtered.filter((j) => j.type === type);
    }

    if (remote === 'true') {
      filtered = filtered.filter((j) => j.isRemote);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedJobs = filtered.slice(start, start + limit);

    // Strip HTML from descriptions for list view (keep first 200 chars)
    const sanitized = paginatedJobs.map((j) => ({
      ...j,
      description: j.description
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 300),
    }));

    res.json({
      success: true,
      data: sanitized,
      pagination: { page, limit, total, totalPages },
    });
  } catch (err: any) {
    console.error('[JobsController] searchJobs error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
}

/**
 * GET /api/jobs/:id
 * Return full job details (with full HTML description)
 */
export async function getJobById(req: Request, res: Response) {
  try {
    const allJobs = await getJobs();
    const job = allJobs.find((j) => j.id === req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, data: job });
  } catch (err: any) {
    console.error('[JobsController] getJobById error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch job' });
  }
}

/**
 * GET /api/jobs/filters/categories
 * Return unique categories for filter dropdowns
 */
export async function getCategories(req: Request, res: Response) {
  try {
    const allJobs = await getJobs();
    const categories = [...new Set(allJobs.map((j) => j.category))].sort();
    res.json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
}

/**
 * GET /api/jobs/filters/types
 * Return unique job types for filter dropdowns
 */
export async function getJobTypes(req: Request, res: Response) {
  try {
    const allJobs = await getJobs();
    const types = [...new Set(allJobs.map((j) => j.type))].sort();
    res.json({ success: true, data: types });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch job types' });
  }
}

/**
 * GET /api/jobs/stats
 * Return job board statistics
 */
export async function getJobStats(req: Request, res: Response) {
  try {
    const allJobs = await getJobs();

    const byCategory: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    let remoteCount = 0;

    allJobs.forEach((j) => {
      byCategory[j.category] = (byCategory[j.category] || 0) + 1;
      byType[j.type] = (byType[j.type] || 0) + 1;
      bySource[j.source] = (bySource[j.source] || 0) + 1;
      if (j.isRemote) remoteCount++;
    });

    res.json({
      success: true,
      data: {
        totalJobs: allJobs.length,
        remoteJobs: remoteCount,
        byCategory: Object.entries(byCategory)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count),
        byType: Object.entries(byType)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count),
        bySource: Object.entries(bySource)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count),
        lastUpdated: lastFetchTime ? new Date(lastFetchTime).toISOString() : null,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
}
