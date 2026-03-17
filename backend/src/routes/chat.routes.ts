import { Router } from 'express';
import { handleChat } from '../controllers/chat.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// We can protect this route later if we only want logged-in users to use it.
// Right now, we leave it open so we can test it easily.
router.post('/', handleChat);

export default router;
