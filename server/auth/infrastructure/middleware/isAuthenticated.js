// server/iniciosesion/infrastructure/middleware/isAuthenticated.js

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.token) {
    // console.log('pasee is authenticated');
    return next();
  } else {
    console.log("Nooo paso isAuthenticated");
    res.redirect("/");
  }
};

module.exports = isAuthenticated;
