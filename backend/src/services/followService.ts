import { Follow } from '../models/Follow';
import { User } from '../models/User';
import { badRequest, notFound } from '../lib/errors';

export async function follow(followerId: string, username: string) {
  const target = await User.findOne({ username: username.toLowerCase() });
  if (!target) throw notFound('User not found');
  if (target.id === followerId) throw badRequest('Cannot follow yourself');
  try {
    await Follow.create({ follower: followerId, followee: target._id } as any);
  } catch (e: any) {
    // duplicate -> already following, ignore
  }
  return target;
}

export async function unfollow(followerId: string, username: string) {
  const target = await User.findOne({ username: username.toLowerCase() });
  if (!target) throw notFound('User not found');
  await Follow.deleteOne({ follower: followerId, followee: target._id });
  return target;
}

export async function listFollowers(username: string) {
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) throw notFound('User not found');
  const edges = await Follow.find({ followee: user._id }).lean();
  const ids = edges.map((e) => e.follower);
  const users = await User.find({ _id: { $in: ids } }, 'username name profilePicture').lean();
  return users;
}

export async function listFollowing(username: string) {
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) throw notFound('User not found');
  const edges = await Follow.find({ follower: user._id }).lean();
  const ids = edges.map((e) => e.followee);
  const users = await User.find({ _id: { $in: ids } }, 'username name profilePicture').lean();
  return users;
}

export async function listFolloweeIds(userId: string) {
  const edges = await Follow.find({ follower: userId }, { followee: 1, _id: 0 }).lean();
  return edges.map((e) => e.followee);
}
