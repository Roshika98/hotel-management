if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const Router = require('./routes');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const flashMiddleware = require('./middleware/flashMiddleware');
const MongoDBStore = require('connect-mongo');
const passport = require('passport');
const User = require('./models/user');
const Employee = require('./models/employee');

const strategies = require('./security/strategy');



const port = process.env.PORT || 3000;
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

passport.use(strategies.googleStrategy);

passport.use(strategies.facebookStrategy);

passport.use(strategies.twitterStrategy);

passport.use(strategies.localStrategy);

passport.use('employee', strategies.employeeStrategy);


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        if (user !== null) {
            done(null, user);
        } else {
            Employee.findById(id).then(employee => {
                done(null, employee);
            })
        }
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

app.use(flash(), flashMiddleware);



app.get('/', (req, res) => {
    res.redirect('/hotel/customer');
});
app.get('/hotel', (req, res) => {
    res.redirect('/hotel/customer');
});
app.use('/hotel/admin', Router.admin);
app.use('/hotel/customer', Router.customer);



app.listen(port, () => {
    console.log('listening on port ' + port);
});