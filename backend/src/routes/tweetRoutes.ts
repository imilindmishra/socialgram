import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../lib/asyncHandler';
import { validate } from '../lib/validate';
import { rateLimitWrite } from '../middleware/rateLimit';
import { create, list, toggleLike, addComment, addReply } from '../controllers/tweetController';
import { toggleRetweetController, createQuoteController, toggleBookmarkController, listBookmarksController } from '../controllers/tweetController';
import {
  TweetCreateSchema,
  TweetIdParamsSchema,
  TweetReplyParamsSchema,
  TweetCommentBodySchema,
  TweetRepliesQuerySchema,
  TweetListQuerySchema,
  QuoteCreateSchema,
} from '../validation';
import { getTweet, listReplies } from '../controllers/tweetController';

const router = Router();

router.get('/', requireAuth, validate(TweetListQuerySchema, 'query'), asyncHandler(list));
router.get(
  '/bookmarks',
  requireAuth,
  validate(TweetRepliesQuerySchema, 'query'),
  asyncHandler(listBookmarksController)
);
router.get('/:id', requireAuth, validate(TweetIdParamsSchema, 'params'), asyncHandler(getTweet));
router.post('/', requireAuth, rateLimitWrite, validate(TweetCreateSchema, 'body'), asyncHandler(create));
router.post('/:id/like', requireAuth, rateLimitWrite, validate(TweetIdParamsSchema, 'params'), asyncHandler(toggleLike));
router.post(
  '/:id/comments',
  requireAuth,
  rateLimitWrite,
  validate(TweetIdParamsSchema, 'params'),
  validate(TweetCommentBodySchema, 'body'),
  asyncHandler(addComment)
);
router.get(
  '/:id/replies',
  requireAuth,
  validate(TweetIdParamsSchema, 'params'),
  validate(TweetRepliesQuerySchema, 'query'),
  asyncHandler(listReplies)
);

router.post(
  '/:id/retweet',
  requireAuth,
  rateLimitWrite,
  validate(TweetIdParamsSchema, 'params'),
  asyncHandler(toggleRetweetController)
);

router.post(
  '/:id/quote',
  requireAuth,
  rateLimitWrite,
  validate(TweetIdParamsSchema, 'params'),
  validate(QuoteCreateSchema, 'body'),
  asyncHandler(createQuoteController)
);

router.post(
  '/:id/bookmark',
  requireAuth,
  rateLimitWrite,
  validate(TweetIdParamsSchema, 'params'),
  asyncHandler(toggleBookmarkController)
);

router.post(
  '/:id/comments/:commentId/replies',
  requireAuth,
  validate(TweetReplyParamsSchema, 'params'),
  validate(TweetCommentBodySchema, 'body'),
  asyncHandler(addReply)
);

export default router;
