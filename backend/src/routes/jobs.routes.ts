import { Router } from 'express';
import { searchJobs, getJobById, getCategories, getJobTypes, getJobStats } from '../controllers/jobs.controller';

const router = Router();

// GET /api/jobs/search?q=&category=&type=&remote=&page=&limit=
router.get('/search', searchJobs);

// GET /api/jobs/filters/categories
router.get('/filters/categories', getCategories);

// GET /api/jobs/filters/types
router.get('/filters/types', getJobTypes);

// GET /api/jobs/stats
router.get('/stats', getJobStats);

// GET /api/jobs/:id
router.get('/:id', getJobById);

export default router;
