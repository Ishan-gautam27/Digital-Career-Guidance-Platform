import { Request, Response } from 'express';
import College from '../models/College';
import NirfRanking from '../models/NirfRanking';
import { syncAllData } from '../services/dataSyncService';

// Search colleges with filters
export const searchColleges = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      q = '',
      state = '',
      course = '',
      minRank = '',
      maxRank = '',
      type = '',
      page = '1',
      limit = '20',
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { state: { $regex: q, $options: 'i' } },
      ];
    }

    if (state) {
      filter.state = { $regex: state, $options: 'i' };
    }

    if (course) {
      filter.courses = { $regex: course, $options: 'i' };
    }

    if (type) {
      filter.type = type;
    }

    if (minRank || maxRank) {
      filter['nirfRanking.rank'] = {};
      if (minRank) filter['nirfRanking.rank'].$gte = parseInt(minRank, 10);
      if (maxRank) filter['nirfRanking.rank'].$lte = parseInt(maxRank, 10);
      // Only include colleges that actually have a NIRF rank
      if (!minRank) filter['nirfRanking.rank'].$gt = 0;
    }

    const [colleges, total] = await Promise.all([
      College.find(filter)
        .sort({ 'nirfRanking.rank': 1, name: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      College.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: colleges,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('[College] Search error:', error);
    res.status(500).json({ success: false, message: 'Error searching colleges' });
  }
};

// Get single college by ID
export const getCollegeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const college = await College.findById(req.params.id).lean();
    if (!college) {
      res.status(404).json({ success: false, message: 'College not found' });
      return;
    }
    res.json({ success: true, data: college });
  } catch (error) {
    console.error('[College] Get by ID error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving college' });
  }
};

// Get unique states for filter dropdown
export const getStates = async (_req: Request, res: Response): Promise<void> => {
  try {
    const states = await College.distinct('state', { state: { $ne: '' } });
    const sortedStates = states.filter(Boolean).sort();
    res.json({ success: true, data: sortedStates });
  } catch (error) {
    console.error('[College] Get states error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving states' });
  }
};

// Get NIRF rankings by year and category
export const getNirfRankings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year = '', category = 'Overall', page = '1', limit = '50' } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (year) filter.year = parseInt(year, 10);
    if (category) filter.category = { $regex: category, $options: 'i' };

    const [rankings, total] = await Promise.all([
      NirfRanking.find(filter)
        .sort({ rank: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      NirfRanking.countDocuments(filter),
    ]);

    // Get available years and categories for filters
    const availableYears = await NirfRanking.distinct('year');
    const availableCategories = await NirfRanking.distinct('category');

    res.json({
      success: true,
      data: rankings,
      filters: {
        availableYears: availableYears.sort((a: number, b: number) => b - a),
        availableCategories: availableCategories.sort(),
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('[College] NIRF rankings error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving NIRF rankings' });
  }
};

// Manually trigger data sync
export const triggerSync = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ success: true, message: 'Data sync started in background' });
    // Run sync in background after responding
    syncAllData().catch((err) =>
      console.error('[College] Background sync error:', err)
    );
  } catch (error) {
    console.error('[College] Trigger sync error:', error);
    res.status(500).json({ success: false, message: 'Error triggering sync' });
  }
};

// Get sync status / stats
export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalColleges = await College.countDocuments();
    const totalRankings = await NirfRanking.countDocuments();
    const byState = await College.aggregate([
      { $match: { state: { $ne: '' } } },
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    const byType = await College.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const bySources = await College.aggregate([
      { $unwind: '$sources' },
      { $group: { _id: '$sources', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalColleges,
        totalRankings,
        topStates: byState,
        byType,
        bySources,
      },
    });
  } catch (error) {
    console.error('[College] Stats error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving stats' });
  }
};
