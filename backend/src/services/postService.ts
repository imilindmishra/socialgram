import { badRequest, notFound } from '../lib/errors';
import type { IPost } from '../models/Post';
import { createPost as repoCreatePost, listPostsPopulated, findPostById, savePost } from '../db/postRepo';

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function createPost(authorId: string, caption?: string, imageUrl?: string) {
  if (!caption || !caption.trim()) throw badRequest('Caption is required');
  if (caption.length > 280) throw badRequest('Caption too long (max 280)');
  if (!imageUrl || !isValidUrl(imageUrl)) throw badRequest('Valid imageUrl required');

  return repoCreatePost({ author: authorId as any, caption: caption.trim(), imageUrl } as unknown as IPost);
}

export async function listPosts() {
  return listPostsPopulated();
}

export async function toggleLike(postId: string, userId: string) {
  const post = await findPostById(postId);
  if (!post) throw notFound('Post not found');

  const already = post.likes.some((u) => u.toString() === userId);
  if (already) {
    post.likes = post.likes.filter((u) => u.toString() !== userId);
  } else {
    post.likes.push(userId as any);
  }

  return savePost(post);
}

export async function addComment(postId: string, userId: string, text?: string) {
  if (!text || !text.trim()) throw badRequest('Comment text is required');
  if (text.length > 500) throw badRequest('Comment too long (max 500)');

  const post = await findPostById(postId);
  if (!post) throw notFound('Post not found');
  post.comments.push({ user: userId as any, text: text.trim(), createdAt: new Date() });
  return savePost(post);
}

