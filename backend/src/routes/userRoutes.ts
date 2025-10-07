import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getPublicProfile, listUserPosts, updateMe } from '../controllers/userController';

const router = Router();

router.get('/:username', getPublicProfile);
router.get('/:username/posts', listUserPosts);
router.patch('/me', requireAuth, updateMe);

export default router;

