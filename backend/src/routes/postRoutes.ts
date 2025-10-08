import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createPost, listPosts, toggleLike, addComment } from '../controllers/postController';
import { asyncHandler } from '../lib/asyncHandler';

const router = Router();

router.get('/', requireAuth, asyncHandler(listPosts));
router.post('/', requireAuth, asyncHandler(createPost));
router.post('/:id/like', requireAuth, asyncHandler(toggleLike));
router.post('/:id/comments', requireAuth, asyncHandler(addComment));

export default router;
