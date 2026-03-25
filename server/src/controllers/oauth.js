import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import { env } from '../config/env.js';

const isGoogleOAuthConfigured = () => !!(env.googleClientId && env.googleClientSecret);

export const oauthStatus = (req, res) => {
  res.json({
    google: {
      enabled: isGoogleOAuthConfigured(),
      callbackUrl: env.googleCallbackUrl,
    },
  });
};

// Configure Passport Google Strategy
export const configureGoogleStrategy = () => {
  if (!isGoogleOAuthConfigured()) {
    console.warn('⚠️  Google OAuth credentials not configured. Google Sign-In will be disabled.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: env.googleCallbackUrl,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`.trim();
          
          if (!email) {
            return done(new Error('No email found in Google profile'));
          }

          // Check if user already exists by email
          let user = await User.findOne({ email });

          if (user) {
            // User exists, update OAuth info if needed
            if (!user.oauthProvider || user.oauthProvider !== 'google') {
              user.oauthProvider = 'google';
              user.oauthId = profile.id;
              user.oauthProfile = profile._json;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user with Google OAuth
          // Create a default organization for the user
          const defaultOrgName = `${name}'s Organization`;
          let organization = await Organization.findOne({ name: defaultOrgName });
          
          if (!organization) {
            organization = new Organization({
              name: defaultOrgName,
              slug: defaultOrgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            });
            await organization.save();
          }

          user = new User({
            fullName: name,
            email,
            organizationId: organization._id,
            role: 'admin',
            oauthProvider: 'google',
            oauthId: profile.id,
            oauthProfile: profile._json,
            // No password for OAuth users
            password: undefined
          });

          await user.save();
          done(null, user);
        } catch (error) {
          console.error('Google OAuth error:', error);
          done(error, null);
        }
      }
    )
  );

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

// Google OAuth login
export const googleAuth = (req, res, next) => {
  if (!isGoogleOAuthConfigured()) {
    if (req.accepts('html')) {
      return res.redirect(`${env.frontendUrl}/login?error=oauth_not_configured`);
    }
    return res.status(503).json({
      error: 'Google OAuth is not configured',
      message: 'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the server environment'
    });
  }
  return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

// Google OAuth callback
export const googleAuthCallback = (req, res, next) => {
  if (!isGoogleOAuthConfigured()) {
    return res.redirect(`${env.frontendUrl}/login?error=oauth_not_configured`);
  }
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth callback error:', err);
      return res.redirect(`${env.frontendUrl}/login?error=oauth_failed`);
    }

    if (!user) {
      return res.redirect(`${env.frontendUrl}/login?error=no_user`);
    }

    try {
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          organizationId: user.organizationId, 
          role: user.role 
        },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
      );

      // Redirect to frontend with token
      res.redirect(`${env.frontendUrl}/oauth/callback?token=${token}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.fullName)}`);
    } catch (error) {
      console.error('Token generation error:', error);
      res.redirect(`${env.frontendUrl}/login?error=token_error`);
    }
  })(req, res, next);
};

// Direct Google OAuth login (for API)
export const googleLogin = async (req, res) => {
  try {
    const { token: googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    // In a real implementation, you would verify the Google token
    // For now, we'll simulate the user creation/login
    // This would require using Google's token verification API
    
    res.status(501).json({ 
      error: 'Direct Google login not implemented. Use OAuth flow instead.',
      message: 'Please use the OAuth redirect flow for Google Sign-In'
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};