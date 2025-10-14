import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../lib/asyncHandler';
import { validateBody, validateParams, validateQuery } from '../lib/validate';
import { create, list, toggleLike, addComment, addReply } from '../controllers/tweetController';
import {
  TweetCreateSchema,
  TweetIdParamsSchema,
  TweetReplyParamsSchema,
  TweetCommentBodySchema,
  TweetRepliesQuerySchema,
} from '../validation';
import { getTweet, listReplies } from '../controllers/tweetController';

const router = Router();

router.get('/', requireAuth, asyncHandler(list));
router.get('/:id', requireAuth, validateParams(TweetIdParamsSchema), asyncHandler(getTweet));
router.post('/', requireAuth, validateBody(TweetCreateSchema), asyncHandler(create));
router.post('/:id/like', requireAuth, validateParams(TweetIdParamsSchema), asyncHandler(toggleLike));
router.post(
  '/:id/comments',
  requireAuth,
  validateParams(TweetIdParamsSchema),
  validateBody(TweetCommentBodySchema),
  asyncHandler(addComment)
);
router.get(
  '/:id/replies',
  requireAuth,
  validateParams(TweetIdParamsSchema),
  validateQuery(TweetRepliesQuerySchema),
  asyncHandler(listReplies)
);
router.post(
  '/:id/comments/:commentId/replies',
  requireAuth,
  validateParams(TweetReplyParamsSchema),
  validateBody(TweetCommentBodySchema),
  asyncHandler(addReply)
);

export default router;
