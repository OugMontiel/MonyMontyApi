const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;

// Discord Strategy
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: "/auth/discord/callback",
      scope: ["identify", "email"],
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
