const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require("passport");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // console.log("Google profile:", profile); 
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // console.log("Existing user found:", user); 
          return done(null, user);
        }

        // create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          provider: 'google',
          googleId: profile.id,
          role: 'job_seeker' 
        });

        console.log("New user created:", user); 
        return done(null, user);
      } catch (error) {
        console.error("Google auth error:", error); 
        return done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
      scope: ['user:email']
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ 
          $or: [
            { githubId: profile.id },
            { email: profile.emails[0].value }
          ] 
        });
        
        if (!user) {
          user = new User({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            password: Math.random().toString(36).slice(-8),
            role: "job_seeker",
            provider: "github",
            isEmailVerified: true
          });
          await user.save();
        }
        
        return done(null, user);
      } catch (error) {
        console.error('GitHub Auth Error:', error);
        return done(error, null);
      }
    }
  ));



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
