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
        res.send('Welcome ' + req.user.facebookProfName);
        console.log(req.user);
        // console.log(req.user.id);
    }
    else res.redirect('/hotel/customer/auth/google/failure');

});

router.get('/failure', (req, res) => {
    res.send("error!!!!");
});


module.exports = router;