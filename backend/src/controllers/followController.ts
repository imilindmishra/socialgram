import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import * as followService from '../services/followService';
import { UsernameParamSchema } from '../validation';

export async function followUser(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { username } = UsernameParamSchema.parse(req.params);
  const target = await followService.follow(userId, username);
  return res.json({ ok: true, following: true, user: { username: target.username, name: target.name, profilePicture: target.profilePicture } });
}

export async function unfollowUser(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { username } = UsernameParamSchema.parse(req.params);
  const target = await followService.unfollow(userId, username);
  return res.json({ ok: true, following: false, user: { username: target.username, name: target.name, profilePicture: target.profilePicture } });
}

export async function listFollowers(req: AuthedRequest, res: Response) {
  const { username } = UsernameParamSchema.parse(req.params);
  const users = await followService.listFollowers(username);
  return res.json({ users });
}

export async function listFollowing(req: AuthedRequest, res: Response) {
  const { username } = UsernameParamSchema.parse(req.params);
  const users = await followService.listFollowing(username);
  return res.json({ users });
}

