const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local');
const User = require('../models/user');

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/hotel/customer/auth/google/redirect'
}, (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ googleId: profile.id, googleProfName: profile.displayName },
        { email: profile.emails[0].value, profPicUrl: profile.photos[0].value }, (err, user) => {
            return cb(err, user);
        });
});

const facebookStrategy = new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/hotel/customer/auth/facebook/redirect',
    profileFields: ['id', 'displayName', 'email', 'picture'],
    auth_type: 'reauthenticate'
}, (accessToken, refreshToken, profile, cb) => {
    // console.log(profile);
    User.findOrCreate({ facebookID: profile.id, facebookProfName: profile.displayName },
        { email: profile.emails[0].value, profPicUrl: profile.photos[0].value }, (err, user) => {
            return cb(err, user);
        });
});

const localStrategy = new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({ email: username }, function (err, user) {
        if (err) return done(err);
        if (!user) {
            // TODO- Instead of passing an object with message use req.flash('failure','message');
            return done(null, false, { message: 'Unknown user ' + username });
        }
        user.authenticate(password, function (err, users, passwordError) {
            if (passwordError) {
                return done(null, false, { message: "password is wrong" })
            } else if (users) {
                return done(null, users);
            }
        });
    });
});

module.exports = { googleStrategy, facebookStrategy, localStrategy };