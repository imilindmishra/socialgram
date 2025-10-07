import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { User } from '../models/User.js';

export function configurePassport() {
  const clientID = process.env.GOOGLE_CLIENT_ID as string;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
  const callbackURL = `${process.env.SERVER_URL}/api/auth/google/callback`;

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value || '';
          const name = profile.displayName || '';
          const profilePicture = profile.photos?.[0]?.value;

          let user = await User.findOne({ googleId });
          if (!user) {
            user = await User.create({ googleId, email, name, profilePicture });
          } else {
            // Update basic fields on login
            user.email = email || user.email;
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

