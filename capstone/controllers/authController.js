const passport = require('passport')
const { initializingPassport, isAuthenticated } = require('../config/passport')

const login = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {return res.status(401).send("Unauthourised");}
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.role = user.role;
      return next();
    });
  })(req, res, next);
};


// Logout route handler
const logout = (req, res) => {
  req.logout();
  res.redirect('/auth/login');
};

// Protected route handler example
const profile = (req, res) => {
  // Access the authenticated user's data through req.user
  res.render('profile', { user: req.user });
};

// Middleware to check if the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
};

module.exports = {
  login,
  logout,
  profile,
  ensureAuthenticated,
};
