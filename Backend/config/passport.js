import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/users.js';

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const defaultCallbackUrl = process.env.NODE_ENV === 'production'
  ? 'https://googlelogin-production-3c33.up.railway.app/api/v1/auth/google/callback'
  : 'http://localhost:4000/api/v1/auth/google/callback';

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL || defaultCallbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();

          if (!email) {
            return done(null, false, { message: 'Google did not return an email address.' });
          }

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              email,
              googleId: profile.id,
              authProvider: 'google',
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            user.authProvider = 'google';
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
} else {
  console.warn('Google OAuth credentials are not configured yet.');
}

export default passport;
