import { Request, Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import * as postService from '../services/postService';

export async function createPost(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { caption, imageUrl } = req.body as { caption?: string; imageUrl?: string };
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const post = await postService.createPost(userId, caption, imageUrl);
  return res.status(201).json({ post });
}

export async function listPosts(_req: Request, res: Response) {
  const posts = await postService.listPosts();
  return res.json({ posts });
}

export async function toggleLike(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const post = await postService.toggleLike(id, userId);
  return res.json({ post });
}

export async function addComment(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { text } = req.body as { text?: string };
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const post = await postService.addComment(id, userId, text);
  return res.status(201).json({ post });
}

export async function addReply(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { id, commentId } = req.params as { id: string; commentId: string };
  const { text } = req.body as { text?: string };
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const post = await postService.addReply(id, commentId, userId, text);
  return res.status(201).json({ post });
}
