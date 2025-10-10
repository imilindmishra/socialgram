import { Request, Response } from 'express';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { AuthedRequest } from '../middleware/auth';

const RESERVED = new Set([
  'admin','root','api','auth','me','post','posts','user','users','login','signup','u','create','feed'
]);

const USERNAME_REGEX = /^[a-z0-9](?:[a-z0-9._]{1,18}[a-z0-9])?$/; // 3-20 total

function validateUsername(u: string): string | null {
  const username = u.toLowerCase().trim();
  if (username.length < 3 || username.length > 20) return 'Username must be 3-20 characters';
  if (!USERNAME_REGEX.test(username)) return 'Only letters, numbers, dots, underscores; no leading/trailing dot/underscore';
  if (RESERVED.has(username)) return 'This username is reserved';
  return null;
}

export async function updateMe(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { username } = req.body as { username?: string };
  if (!username) return res.status(400).json({ error: 'username is required' });
  const msg = validateUsername(username);
  if (msg) return res.status(400).json({ error: msg });

  const exists = await User.findOne({ username: username.toLowerCase() });
  if (exists && exists.id !== userId) {
    return res.status(409).json({ error: 'Username already taken' });
  }
  const updated = await User.findByIdAndUpdate(
    userId,
    { username: username.toLowerCase() },
    { new: true, projection: 'name email profilePicture username createdAt' }
  );
  return res.json({ user: updated });
}

export async function getPublicProfile(req: Request, res: Response) {
  const { username } = req.params;
  const user = await User.findOne({ username: username.toLowerCase() }, 'name profilePicture username createdAt');
  if (!user) return res.status(404).json({ error: 'User not found' });
  const counts = await Post.aggregate([
    { $match: { author: user._id } },
    { $group: { _id: null, posts: { $sum: 1 } } },
  ]);
  const postsCount = counts[0]?.posts || 0;
  res.json({ user, stats: { posts: postsCount } });
}

export async function listUserPosts(req: Request, res: Response) {
  const { username } = req.params;
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const posts = await Post.find({ author: user._id })
    .sort({ createdAt: -1 })
    .populate('author', 'name profilePicture')
    .populate('comments.user', 'name profilePicture')
    .populate('comments.replies.user', 'name profilePicture');
  res.json({ posts });
}

export async function searchUsers(req: Request, res: Response) {
  const q = String((req.query.q as string) || '').toLowerCase().trim();
  if (!q) return res.json({ users: [] });
  // Prefix match on username, fallback to name contains
  const regex = new RegExp('^' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const users = await User.find(
    {
      $or: [
        { username: { $regex: regex } },
        { name: { $regex: q, $options: 'i' } },
      ],
    },
    'username name profilePicture'
  )
    .sort({ username: 1 })
    .limit(8)
    .lean();
  res.json({ users });
}
