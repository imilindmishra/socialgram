import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createPost, listPosts, toggleLike, addComment } from '../controllers/postController';

const router = Router();

router.get('/', requireAuth, listPosts);
router.post('/', requireAuth, createPost);
router.post('/:id/like', requireAuth, toggleLike);
router.post('/:id/comments', requireAuth, addComment);

export default router;
