import { Router } from 'express';
import { checkHealth } from '../controllers/health.controller';

import authRoutes from './auth.routes';
import chatRoutes from './chat.routes';
import eventRoutes from './event.routes';
import collegeRoutes from './college.routes';
import jobsRoutes from './jobs.routes';

const router = Router();

// Health check route
router.get('/health', checkHealth);

// In the future, other routes will be added here
// router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/events', eventRoutes);
router.use('/colleges', collegeRoutes);
router.use('/jobs', jobsRoutes);

export default router;
