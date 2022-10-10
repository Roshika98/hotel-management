if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const Router = require('./routes');
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongo');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const localStrategy = require('passport-local');
const User = require('./models/user');

const port = 3000;
const dbUrl = process.env.MONGODB_URL;
const storeOpt = {
    mongoUrl: dbUrl,
    secret: 'This is a secret',
    touchAfter: 24 * 3600
};

mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
});

const sessionConfig = {
    secret: 'This is a secret',
    store: MongoDBStore.create(storeOpt),
    name: 'session',
    resave: true,
    saveUninitialized: true,
};

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/hotel/customer/auth/google/redirect'
}, (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ googleId: profile.id, googleProfName: profile.displayName },
        { email: profile.emails[0].value, profPicUrl: profile.photos[0].value }, (err, user) => {
            return cb(err, user);
        });
}));

passport.use(new FacebookStrategy({
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

}));


passport.use(new localStrategy({
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
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});


app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());






app.use('/hotel/admin', Router.admin);
app.use('/hotel/customer', Router.customer);



server.listen(port, () => {
    console.log('listening on port ' + port);
});