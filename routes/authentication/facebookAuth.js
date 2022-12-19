const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('', passport.authenticate('facebook', {
    scope: 'public_profile,email',
    auth_type: 'reauthenticate',
}));

router.get('/redirect', passport.authenticate('facebook', {
    successRedirect: '/hotel/customer/auth/facebook/success',
    failureRedirect: '/hotel/customer/auth/facebook/failure'
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