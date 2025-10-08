import { badRequest, notFound } from '../lib/errors';
import type { IPost } from '../models/Post';
import type { IPostRepo } from '../interfaces/postRepo';
import { postRepo as defaultPostRepo } from '../db/postRepo';

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

let repo: IPostRepo = defaultPostRepo;

export function usePostRepo(r: IPostRepo) {
  repo = r;
}

export function createPostService(r: IPostRepo) {
  return {
    createPost: (authorId: string, caption?: string, imageUrl?: string) => createPost(authorId, caption, imageUrl, r),
    listPosts: () => listPosts(r),
    toggleLike: (postId: string, userId: string) => toggleLike(postId, userId, r),
    addComment: (postId: string, userId: string, text?: string) => addComment(postId, userId, text, r),
  };
}

export async function createPost(authorId: string, caption?: string, imageUrl?: string, repoArg: IPostRepo = repo) {
  if (!caption || !caption.trim()) throw badRequest('Caption is required');
  if (caption.length > 280) throw badRequest('Caption too long (max 280)');
  if (!imageUrl || !isValidUrl(imageUrl)) throw badRequest('Valid imageUrl required');

  return repoArg.create({ author: authorId as any, caption: caption.trim(), imageUrl } as unknown as IPost);
}

export async function listPosts(repoArg: IPostRepo = repo) {
  return repoArg.list();
}

export async function toggleLike(postId: string, userId: string, repoArg: IPostRepo = repo) {
  const post = await repoArg.findById(postId);
  if (!post) throw notFound('Post not found');

  const already = post.likes.some((u) => u.toString() === userId);
  if (already) {
    post.likes = post.likes.filter((u) => u.toString() !== userId);
  } else {
    post.likes.push(userId as any);
  }

  return repoArg.save(post);
}

export async function addComment(postId: string, userId: string, text?: string, repoArg: IPostRepo = repo) {
  if (!text || !text.trim()) throw badRequest('Comment text is required');
  if (text.length > 500) throw badRequest('Comment too long (max 500)');

  const post = await repoArg.findById(postId);
  if (!post) throw notFound('Post not found');
  post.comments.push({ user: userId as any, text: text.trim(), createdAt: new Date() });
  return repoArg.save(post);
}
