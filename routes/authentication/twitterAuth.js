const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('', passport.authenticate('twitter'))

router.get('/redirect', passport.authenticate('twitter', {
    successRedirect: '/hotel/customer/auth/twitter/success',
    failureRedirect: '/hotel/customer/auth/twitter/failure'
}));

router.get('/success', (req, res) => {
    // if (req.isAuthenticated()) {
    //     res.send('Welcome ' + req.user.googleProfName);
    //     // console.log(req.user);
    //     // console.log(req.user.id);
    // }
    // else res.redirect('/hotel/customer/auth/twitter/failure');
    res.send(req.user);
});

router.get('/failure', (req, res) => {
    res.send("error!!!!");
});


module.exports = router;