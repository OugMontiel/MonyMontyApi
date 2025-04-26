const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

// Github Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
      scope: ["user:email"],
      state: true,
    },
    (accessToken, refreshToken, profile, done) => {
      // Aquí puedes buscar o crear un usuario en tu base de datos
      return done(null, profile);
    }
  )
);

// Serializa el usuario para la sesión
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserializa el usuario de la sesión
passport.deserializeUser((obj, done) => {
  done(null, obj);
});
