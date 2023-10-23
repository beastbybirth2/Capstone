const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')
const keys = require('./keys')

exports.initializingPassport = (passport) => {

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        console.log(email, password);
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false);
            console.log("Email found");
            if (user.password !== password) return done(null, false);
            console.log("Password validated");
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, { id: user.id, role: user.role });
    });

    passport.deserializeUser(async (data, done) => {
        try {
            // const user = await User.findById(data.id);
                done(null, data);
           
        } catch (err) {
            done(err, false);
        }
    });
}

exports.isAuthenticated = (req, res, next) => {
    if (req.user) {
        console.log(req.user + " is authenticated");
        return next();
    }
    res.redirect("/auth/login");
}