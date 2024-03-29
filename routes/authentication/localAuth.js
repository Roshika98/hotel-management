const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/user');

router.get('/success', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/hotel/customer');
    }
    else {
        req.flash('error', 'something went wrong!');
        res.redirect('/hotel/customer/auth');
    }
});

router.get('/failure', (req, res) => {
    req.flash('error', 'email or password is incorrect!');
    res.redirect('/hotel/customer/auth');

});


router.post('/signup', async (req, res) => {
    var { email, password } = req.body;
    console.log(email + " " + password);
    const user = new User({ email: email, isLoyaltyCustomer: true });
    const newUser = await User.register(user, password);
    console.log(newUser);
    res.redirect('/hotel/customer/auth');
});


router.post('', passport.authenticate('local', { failureRedirect: '/hotel/customer/auth/local/failure' }), (req, res) => {
    // console.log(req.body);
    res.redirect('/hotel/customer/auth/local/success');
});

module.exports = router;