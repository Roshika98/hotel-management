const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/user');

router.get('/success', (req, res) => {
    console.log('Success came');
    if (req.isAuthenticated()) {
        console.log('inside success');
        console.log(req.user);
        res.send('Welcome basic login ' + req.user.email);

    }
    else res.redirect('/hotel/customer/auth/google/failure');
});


router.post('/signup', async (req, res) => {
    var { email, password } = req.body;
    console.log(email + " " + password);
    const user = new User({ email: email });
    const newUser = await User.register(user, password);
    console.log(newUser);
    res.redirect('/hotel/customer/auth');
});


router.post('', passport.authenticate('local', { failureRedirect: '/hotel/customer/auth/google/failure' }), (req, res) => {
    // console.log(req.body);
    res.redirect('/hotel/customer/auth/local/success');
});

module.exports = router;