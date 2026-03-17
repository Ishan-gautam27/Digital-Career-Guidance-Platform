import { Router } from 'express';
import {
  searchColleges,
  getCollegeById,
  getStates,
  getNirfRankings,
  triggerSync,
  getStats,
} from '../controllers/college.controller';

const router = Router();

// GET /api/colleges/search?q=&state=&course=&minRank=&maxRank=&type=&page=&limit=
router.get('/search', searchColleges);

// GET /api/colleges/filters/states
router.get('/filters/states', getStates);

// GET /api/colleges/rankings/nirf?year=&category=&page=&limit=
router.get('/rankings/nirf', getNirfRankings);

// GET /api/colleges/stats
router.get('/stats', getStats);

// POST /api/colleges/sync
router.post('/sync', triggerSync);

// GET /api/colleges/:id
router.get('/:id', getCollegeById);

export default router;
