import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getPublicProfile, listUserPosts, updateMe } from '../controllers/userController';
import { asyncHandler } from '../lib/asyncHandler';

const router = Router();

router.get('/:username', asyncHandler(getPublicProfile));
router.get('/:username/posts', asyncHandler(listUserPosts));
router.patch('/me', requireAuth, asyncHandler(updateMe));

export default router;
