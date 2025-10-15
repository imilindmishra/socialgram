import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getPublicProfile, listUserPosts, updateMe, searchUsers } from '../controllers/userController';
import { asyncHandler } from '../lib/asyncHandler';
import { validate } from '../lib/validate';
import { UsernameParamSchema } from '../validation';
import { rateLimitWrite } from '../middleware/rateLimit';
import { followUser, unfollowUser, listFollowers, listFollowing } from '../controllers/followController';

const router = Router();

// Search must come before param routes
router.get('/search', asyncHandler(searchUsers));

// Follow/unfollow and social graphs
router.post('/:username/follow', requireAuth, rateLimitWrite, validate(UsernameParamSchema, 'params'), asyncHandler(followUser));
router.delete('/:username/follow', requireAuth, rateLimitWrite, validate(UsernameParamSchema, 'params'), asyncHandler(unfollowUser));
router.get('/:username/followers', validate(UsernameParamSchema, 'params'), asyncHandler(listFollowers));
router.get('/:username/following', validate(UsernameParamSchema, 'params'), asyncHandler(listFollowing));

// Profile and posts
router.get('/:username', asyncHandler(getPublicProfile));
router.get('/:username/posts', asyncHandler(listUserPosts));
router.patch('/me', requireAuth, rateLimitWrite, asyncHandler(updateMe));

export default router;
