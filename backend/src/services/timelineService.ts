import { Types } from 'mongoose';
import { Post } from '../models/Post';
import { listFolloweeIds } from './followService';

export async function getHomeTimeline(userId: string, limit: number, cursor?: string) {
  const followees = await listFolloweeIds(userId);
  const authors: Types.ObjectId[] = [new Types.ObjectId(userId), ...followees.map((id: any) => new Types.ObjectId(id))];
  const filter: any = { author: { $in: authors } };
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

