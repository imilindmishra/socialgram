import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getPublicProfile, listUserPosts, updateMe, searchUsers } from '../controllers/userController';
import { asyncHandler } from '../lib/asyncHandler';
import { validateParams } from '../lib/validate';
import { UsernameParamSchema } from '../validation';
import { followUser, unfollowUser, listFollowers, listFollowing } from '../controllers/followController';

const router = Router();

// Search must come before param routes
router.get('/search', asyncHandler(searchUsers));

// Follow/unfollow and social graphs
router.post('/:username/follow', requireAuth, validateParams(UsernameParamSchema), asyncHandler(followUser));
router.delete('/:username/follow', requireAuth, validateParams(UsernameParamSchema), asyncHandler(unfollowUser));
router.get('/:username/followers', validateParams(UsernameParamSchema), asyncHandler(listFollowers));
router.get('/:username/following', validateParams(UsernameParamSchema), asyncHandler(listFollowing));

// Profile and posts
router.get('/:username', asyncHandler(getPublicProfile));
router.get('/:username/posts', asyncHandler(listUserPosts));
router.patch('/me', requireAuth, asyncHandler(updateMe));

export default router;
