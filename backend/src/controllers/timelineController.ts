import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { TimelineQuerySchema } from '../validation';
import * as timelineService from '../services/timelineService';

export async function homeTimeline(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { limit, cursor } = TimelineQuerySchema.parse(req.query);
  const { posts, nextCursor } = await timelineService.getHomeTimeline(userId, limit, cursor);
  return res.json({ posts, nextCursor });
}

