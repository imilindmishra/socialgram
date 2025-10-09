import { Router } from 'express';
import passport from 'passport';
import { configurePassport } from '../config/passport';
import { signJwt } from '../utils/jwt';
import { requireAuth } from '../middleware/auth';
import { User } from '../models/User';
import { CLIENT_URL } from '../constants/env';
import { asyncHandler } from '../lib/asyncHandler';

configurePassport();

const router = Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/failure', session: false }),
  asyncHandler((req, res) => {
    const user = (req.user as any) as { id: string; _id: string; email: string; name: string };
    const token = signJwt({ sub: (user._id || user.id).toString(), email: user.email, name: user.name });
    const redirectUrl = `${CLIENT_URL}/auth/callback?token=${encodeURIComponent(token)}`;
    res.redirect(redirectUrl);
  })
);

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = (req as any).user as { id: string; email: string; name: string } | undefined;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const me = await User.findById(user.id, 'name email profilePicture username');
  res.json({ user: { id: user.id, email: me?.email || user.email, name: me?.name || user.name, username: me?.username || null, profilePicture: me?.profilePicture } });
}));

router.get('/failure', (_req, res) => {
  res.status(401).json({ error: 'Google authentication failed' });
});

export default router;
