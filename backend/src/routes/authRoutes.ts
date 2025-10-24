import { Router } from 'express';
import passport from 'passport';
import { configurePassport } from '../config/passport';
import { signJwt } from '../utils/jwt';
import { requireAuth } from '../middleware/auth';
import { User } from '../models/User';
import { CLIENT_URL } from '../constants/env';
import { asyncHandler } from '../lib/asyncHandler';
import { decryptPII } from '../lib/kms';   

configurePassport();

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// After Google callback, we decrypt email before putting it in the JWT (if you need email in the token).
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/failure', session: false }),
  asyncHandler(async (req, res) => {
    const user = req.user as any; 
    const userId = (user._id || user.id).toString();

    
    const decryptedEmail = await decryptPII(user.emailEnc);

    
    const token = signJwt({ sub: userId, email: decryptedEmail, name: user.name });

    const redirectUrl = `${CLIENT_URL}/auth/callback?token=${encodeURIComponent(token)}`;
    res.redirect(redirectUrl);
  })
);


router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const authed = (req as any).user as { id: string } | undefined;
    if (!authed) return res.status(401).json({ error: 'Unauthorized' });

    // Fetch only the fields we need (emailEnc instead of email)
    const me = await User.findById(authed.id, 'name emailEnc profilePicture username');
    if (!me) return res.status(401).json({ error: 'Unauthorized' });

    // ✅ Decrypt email for response
    const email = await decryptPII(me.emailEnc);

    res.json({
      user: {
        id: authed.id,
        email,
        name: me.name,
        username: me.username ?? null,
        profilePicture: me.profilePicture,
      },
    });
  })
);

router.get('/failure', (_req, res) => {
  res.status(401).json({ error: 'Google authentication failed' });
});

export default router;
