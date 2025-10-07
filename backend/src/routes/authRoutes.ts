import { Router } from 'express';
import passport from 'passport';
import { configurePassport } from '../config/passport.js';
import { signJwt } from '../utils/jwt.js';
import { requireAuth, AuthedRequest } from '../middleware/auth.js';

configurePassport();

const router = Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/failure', session: false }),
  (req, res) => {
    const user = (req.user as any) as { id: string; _id: string; email: string; name: string };
    const token = signJwt({ sub: (user._id || user.id).toString(), email: user.email, name: user.name });
    const clientUrl = process.env.CLIENT_URL as string;
    const redirectUrl = `${clientUrl}/auth/callback?token=${encodeURIComponent(token)}`;
    res.redirect(redirectUrl);
  }
);

router.get('/me', requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: req.user });
});

router.get('/failure', (_req, res) => {
  res.status(401).json({ error: 'Google authentication failed' });
});

export default router;
