import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../lib/asyncHandler';
import { validateQuery } from '../lib/validate';
import { TimelineQuerySchema } from '../validation';
import { homeTimeline } from '../controllers/timelineController';

const router = Router();

router.get('/home', requireAuth, validateQuery(TimelineQuerySchema), asyncHandler(homeTimeline));

export default router;

