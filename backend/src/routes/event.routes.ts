import { Router } from 'express';
import { getEvents, createEvent, deleteEvent, updateEvent } from '../controllers/event.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all event routes to ensure user is logged in
router.use(protect);

router.get('/', getEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
