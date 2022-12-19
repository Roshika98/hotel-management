const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
}))

router.get('/redirect', passport.authenticate('google', {
    successRedirect: '/hotel/customer/auth/google/success',
    failureRedirect: '/hotel/customer/auth/google/failure'
}));

router.get('/success', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/hotel/customer');
    }
    else res.redirect('/hotel/customer/auth/google/failure');
});

router.get('/failure', (req, res) => {
    req.flash('error', 'Something went wrong!');
    res.redirect('/hotel/customer/auth');
});


module.exports = router;