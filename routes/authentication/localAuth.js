const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/success', (req, res) => {
    console.log('Success came');
    if (req.isAuthenticated()) {
        console.log('inside success');
        console.log(req.user);
        res.send('Welcome basic login ' + req.user.email);

    }
    else res.redirect('/hotel/customer/auth/google/failure');
});


router.post('', passport.authenticate('local', { failureRedirect: '/hotel/customer/auth/google/failure' }), (req, res) => {
    // console.log(req.body);
    res.redirect('/hotel/customer/auth/local/success');
});

module.exports = router;