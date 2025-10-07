import { Request, Response } from 'express';
import { Post } from '../models/Post';
import { AuthedRequest } from '../middleware/auth';

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function createPost(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { caption, imageUrl } = req.body as { caption?: string; imageUrl?: string };

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!caption || !caption.trim()) return res.status(400).json({ error: 'Caption is required' });
  if (caption.length > 280) return res.status(400).json({ error: 'Caption too long (max 280)' });
  if (!imageUrl || !isValidUrl(imageUrl)) return res.status(400).json({ error: 'Valid imageUrl required' });

  const post = await Post.create({ author: userId, caption: caption.trim(), imageUrl });
  const populated = await post.populate('author', 'name profilePicture');
  return res.status(201).json({ post: populated });
}

export async function listPosts(_req: Request, res: Response) {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate('author', 'name profilePicture')
    .populate('comments.user', 'name profilePicture');
  return res.json({ posts });
}

export async function toggleLike(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const already = post.likes.some((u) => u.toString() === userId);
  if (already) {
    post.likes = post.likes.filter((u) => u.toString() !== userId);
  } else {
    post.likes.push((userId as unknown) as any);
  }
  await post.save();
  const populated = await post.populate([
    { path: 'author', select: 'name profilePicture' },
    { path: 'comments.user', select: 'name profilePicture' },
  ]);
  return res.json({ post: populated });
}

export async function addComment(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { text } = req.body as { text?: string };
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text is required' });
  if (text.length > 500) return res.status(400).json({ error: 'Comment too long (max 500)' });

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  post.comments.push({ user: (userId as unknown) as any, text: text.trim(), createdAt: new Date() });
  await post.save();
  const populated = await post.populate([
    { path: 'author', select: 'name profilePicture' },
    { path: 'comments.user', select: 'name profilePicture' },
  ]);
  return res.status(201).json({ post: populated });
}
