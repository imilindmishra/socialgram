import { Request, Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import {
  createTweet,
  listTweets,
  toggleTweetLike,
  addTweetComment,
  addTweetReply,
} from '../services/tweetService';
import { getTweetById, getTweetReplies, listTweetsPaged } from '../services/tweetService';
import { toggleRetweet, createQuote, toggleBookmark, listBookmarks } from '../services/tweetService';

export async function create(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { text, media } = req.body as { text?: string; media?: string[] };
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const post = await createTweet(userId, text, media || []);
  return res.status(201).json({ post });
}

export async function list(req: Request, res: Response) {
  const limit = Number((req.query as any).limit) || 20;
  const cursor = (req.query as any).cursor as string | undefined;
  const data = await listTweetsPaged(limit, cursor);
  return res.json(data);
}

export async function getTweet(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const post = await getTweetById(id);
  const likeCount = post.likes?.length || 0;
  const replyCount = (post.comments?.length || 0) + (post.comments || []).reduce((acc: number, c: any) => acc + ((c.replies?.length) || 0), 0);
  return res.json({ post, counts: { likeCount, replyCount } });
}

export async function listReplies(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const { limit, cursor } = req.query as any;
  const { replies, nextCursor } = await getTweetReplies(id, Number(limit) || 20, cursor as string | undefined);
  return res.json({ replies, nextCursor });
}

export async function toggleLike(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const post = await toggleTweetLike(id, userId);
  return res.json({ post });
}

export async function toggleRetweetController(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params as { id: string };
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const post = await toggleRetweet(id, userId);
  return res.json({ post });
}

export async function createQuoteController(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params as { id: string };
  const { text, media } = req.body as { text?: string; media?: string[] };
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const post = await createQuote(userId, id, text || '', media || []);
  return res.status(201).json({ post });
}

export async function toggleBookmarkController(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params as { id: string };
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const result = await toggleBookmark(userId, id);
  return res.json(result);
}

export async function listBookmarksController(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const limit = Number((req.query as any).limit) || 20;
  const cursor = (req.query as any).cursor as string | undefined;
  const data = await listBookmarks(userId, limit, cursor);
  return res.json(data);
}

export async function addComment(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { text } = req.body as { text?: string };
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const post = await addTweetComment(id, userId, text);
  return res.status(201).json({ post });
}

export async function addReply(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { id, commentId } = req.params as { id: string; commentId: string };
  const { text } = req.body as { text?: string };
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const post = await addTweetReply(id, commentId, userId, text);
  return res.status(201).json({ post });
}
