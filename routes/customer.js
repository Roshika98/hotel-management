const express = require('express');
const router = express.Router();
const auth = require('./authentication');


router.use('/auth/google', auth.googleAuth);
router.use('/auth/local', auth.localAuth);


router.get('', (req, res) => {
    res.render('customer/customerLayout', { layout: false });
});

router.get('/auth', (req, res) => {
    res.send(`<div><button><a href='/hotel/customer/auth/google'>Login With Google</a></button></div>
    <div><form action='/hotel/customer/auth/local' method='POST'><input type='email' name='email'><input type='password' name='password'>
    <button>submit</button></form></div>`);
});

router.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        req.session.destroy();
        res.send('user logged out');
    });
});

module.exports = router;


