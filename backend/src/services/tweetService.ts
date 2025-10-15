
import { listPosts as listTweets, toggleLike as toggleLikeBase, addComment as addCommentBase, addReply as addReplyBase } from './postService';
import type { IPostRepo } from '../interfaces/postRepo';
import { postRepo as defaultPostRepo } from '../db/postRepo';
import { findPopulatedById } from '../db/postRepo';
import { badRequest } from '../lib/errors';
import { notFound } from '../lib/errors';
import { Post } from '../models/Post';
import { Bookmark } from '../models/Bookmark';
// Hashtag indexing, notifications removed

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
  const created = await repo.create({ author: authorId as any, caption, imageUrl, mediaUrls } as any);
  return created;
}

export { listTweets };

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

export async function toggleTweetLike(postId: string, userId: string) {
  const updated = await toggleLikeBase(postId, userId);
  return updated;
}

export async function addTweetComment(id: string, userId: string, text?: string) {
  const updated = await addCommentBase(id, userId, text);
  return updated;
}

export async function addTweetReply(postId: string, commentId: string, userId: string, text?: string) {
  const updated = await addReplyBase(postId, commentId, userId, text);
  return updated;
}

export async function toggleRetweet(postId: string, userId: string) {
  const post = await Post.findById(postId);
  if (!post) throw notFound('Post not found');
  const has = (post.retweets || []).some((u) => u.toString() === userId);
  if (has) {
    post.retweets = (post.retweets || []).filter((u) => u.toString() !== userId) as any;
  } else {
    post.retweets = [...(post.retweets || []), userId as any];
  }
  await post.save();
  return findPopulatedById(post.id);
}

export async function createQuote(authorId: string, parentId: string, text: string, media?: string[] | null) {
  const parent = await Post.findById(parentId);
  if (!parent) throw notFound('Post not found');
  const caption = (text || '').trim();
  if (!caption) throw badRequest('Caption is required');
  const mediaUrls = Array.isArray(media) ? media : [];
  const imageUrl = mediaUrls[0];
  const created = await Post.create({
    author: authorId as any,
    caption,
    imageUrl,
    mediaUrls,
    quoteOf: parent._id,
  } as any);
  // removed hashtags indexing and notifications
  return findPopulatedById(created.id);
}

export async function toggleBookmark(userId: string, postId: string) {
  const existing = await Bookmark.findOne({ user: userId, tweet: postId });
  if (existing) {
    await Bookmark.deleteOne({ _id: existing._id });
    return { bookmarked: false };
  }
  await Bookmark.create({ user: userId as any, tweet: postId as any } as any);
  return { bookmarked: true };
}

export async function listBookmarks(userId: string, limit: number, cursor?: string) {
  const filter: any = { user: userId };
  if (cursor) filter.createdAt = { $lt: new Date(cursor) };
  const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  const tweetIds = bookmarks.map((b) => b.tweet);
  const posts = await Post.find({ _id: { $in: tweetIds } })
    .sort({ createdAt: -1 })
    .populate('author', 'name profilePicture')
    .populate('comments.user', 'name profilePicture')
    .populate('comments.replies.user', 'name profilePicture');
  const nextCursor = bookmarks.length === limit ? new Date(bookmarks[bookmarks.length - 1].createdAt).toISOString() : undefined;
  return { posts, nextCursor };
}

export async function listTweetsPaged(limit: number, cursor?: string) {
  const filter: any = {};
  if (cursor) filter.createdAt = { $lt: new Date(cursor) };
  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('author', 'name profilePicture')
    .populate('comments.user', 'name profilePicture')
    .populate('comments.replies.user', 'name profilePicture');
  const nextCursor = posts.length === limit ? posts[posts.length - 1].createdAt.toISOString() : undefined;
  return { posts, nextCursor };
}
