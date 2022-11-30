const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const Employee = require('../models/employee');

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' ? 'https://se-project.onrender.com/hotel/customer/auth/google/redirect' : '/hotel/customer/auth/google/redirect',
}, (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ googleId: profile.id, name: profile.displayName },
        { email: profile.emails[0].value, profPicUrl: profile.photos[0].value, isLoyaltyCustomer: true }, (err, user) => {
            return cb(err, user);
        });
});

const facebookStrategy = new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' ? 'https://se-project.onrender.com/hotel/customer/auth/facebook/redirect' : '/hotel/customer/auth/facebook/redirect',
    profileFields: ['displayName', 'emails', 'photos'],
    // passReqToCallback: true
}, (accessToken, refreshToken, profile, cb) => {
    console.log(profile);
    User.findOrCreate({ facebookID: profile.id, name: profile.displayName },
        { email: profile.emails[0].value, profPicUrl: profile.photos[0].value, isLoyaltyCustomer: true }, (err, user) => {
            return cb(err, user);
        });
});

const twitterStrategy = new TwitterStrategy({
    consumerKey: process.env.TWITTER_CLIENT_ID,
    consumerSecret: process.env.TWITTER_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' ? 'https://se-project.onrender.com/hotel/customer/auth/twitter/redirect' : '/hotel/customer/auth/twitter/redirect',
    includeEmail: true
}, (accessToken, refreshToken, profile, cb) => {
    // console.log(profile);
    User.findOrCreate({ twitterID: profile.id, name: profile.displayName },
        { email: profile.emails[0].value, profPicUrl: profile.photos[0].value, isLoyaltyCustomer: true }, (err, user) => {
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

const employeeStrategy = new LocalStrategy(
    function (username, password, done) {
        Employee.findOne({ username: username }, function (err, user) {
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
    }
);

module.exports = { employeeStrategy, googleStrategy, facebookStrategy, twitterStrategy, localStrategy };