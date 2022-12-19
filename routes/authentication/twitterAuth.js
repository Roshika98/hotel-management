const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('', passport.authenticate('twitter'))

router.get('/redirect', passport.authenticate('twitter', {
    successRedirect: '/hotel/customer/auth/twitter/success',
    failureRedirect: '/hotel/customer/auth/twitter/failure'
}));

router.get('/success', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/hotel/customer');
    }
    else res.redirect('/hotel/customer/auth/twitter/failure');
    // res.send(req.user);
});

router.get('/failure', (req, res) => {
    req.flash('error', 'Something went wrong!');
    res.redirect('/hotel/customer/auth');
});


module.exports = router;