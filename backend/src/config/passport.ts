import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { User } from '../models/User';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_URL } from '../constants/env';
import { encryptPII } from '../lib/kms';   

export function configurePassport() {
  const clientID = GOOGLE_CLIENT_ID as string;
  const clientSecret = GOOGLE_CLIENT_SECRET as string;
  const callbackURL = `${SERVER_URL}/api/auth/google/callback`;

  passport.use(
    new GoogleStrategy(
      { clientID, clientSecret, callbackURL },
      async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value || '';
          const name = profile.displayName || '';
          const profilePicture = profile.photos?.[0]?.value;

          let user = await User.findOne({ googleId });
          const emailEnc = await encryptPII(email);   // 🔐

          if (!user) {
            user = await User.create({ googleId, emailEnc, name, profilePicture });
          } else {
            // Update basic fields on login (without storing plaintext)
            user.emailEnc = email ? emailEnc : user.emailEnc;
            user.name = name || user.name;
            user.profilePicture = profilePicture || user.profilePicture;
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err as any);
        }
      }
    )
  );
}
