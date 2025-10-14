
import { listPosts as listTweets, toggleLike as toggleTweetLike, addComment as addTweetComment, addReply as addTweetReply } from './postService';
import type { IPostRepo } from '../interfaces/postRepo';
import { postRepo as defaultPostRepo } from '../db/postRepo';
import { findPopulatedById } from '../db/postRepo';
import { badRequest } from '../lib/errors';
import { notFound } from '../lib/errors';

export async function createTweet(
  authorId: string,
  text?: string,
  media?: string[] | null,
  repo: IPostRepo = defaultPostRepo
) {
  const caption = (text || '').trim();
  if (!caption) {
    throw badRequest('Caption is required');
  }
  const mediaUrls = Array.isArray(media) ? media : [];
  const imageUrl = mediaUrls[0];
  return repo.create({ author: authorId as any, caption, imageUrl, mediaUrls } as any);
}

export { listTweets, toggleTweetLike, addTweetComment, addTweetReply };

export async function getTweetById(id: string) {
  const post = await findPopulatedById(id);
  if (!post) throw notFound('Post not found');
  return post;
}

export async function getTweetReplies(postId: string, limit: number, cursor?: string) {
  const post = await findPopulatedById(postId);
  if (!post) throw notFound('Post not found');
  // Sort comments by createdAt desc
  const comments = (post.comments || []).slice().sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  let filtered = comments;
  if (cursor) {
    const cursorDate = new Date(cursor);
    filtered = comments.filter((c: any) => new Date(c.createdAt) < cursorDate);
  }
  const page = filtered.slice(0, limit);
  const nextCursor = page.length === limit ? page[page.length - 1].createdAt.toISOString() : undefined;
  return { replies: page, nextCursor };
}
