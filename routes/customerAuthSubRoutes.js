const express = require('express');
const router = express.Router();
const auth = require('./authentication');
const custLayout = 'customer/layout';

router.use('/google', auth.googleAuth);
router.use('/local', auth.localAuth);
router.use('/facebook', auth.facebookAuth);
router.use('/twitter', auth.twitterAuth);

router.get('', (req, res) => {
    const user = checkUserAuth(req);
    res.render('customer/partials/login', { layout: custLayout, script: '', user: user });
});


router.get('/logout', (req, res) => {
    req.logout((err) => {
        req.session.destroy();
        res.redirect('/hotel/customer');
    });
});


module.exports = router;


function checkUserAuth(req) {
    var user = null;
    if (req.isAuthenticated()) {
        user = req.user;
    }
    return user;
}
