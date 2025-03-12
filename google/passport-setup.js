const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,       // votre Client ID
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // votre Client Secret
    callbackURL: "/auth/google/callback"            // URL de redirection après connexion
  },
  (accessToken, refreshToken, profile, done) => {
    // Ici, vous pouvez rechercher l'utilisateur dans votre base de données et le créer s'il n'existe pas
    // Pour cet exemple, nous retournons simplement le profil Google
    return done(null, profile);
  }
));

// Sérialisation et désérialisation de l'utilisateur pour les sessions
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
