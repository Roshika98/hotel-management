const express = require('express');
const router = express.Router();
const auth = require('./authentication');

const custLayout = 'customer/layout';

router.use('/auth/google', auth.googleAuth);
router.use('/auth/local', auth.localAuth);



router.get('', (req, res) => {
    res.render('customer/partials/welcomePage', { layout: custLayout });
});

router.get('/auth', (req, res) => {
    res.render('customer/partials/login', { layout: custLayout });
});

router.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        req.session.destroy();
        res.send('user logged out');
    });
});

module.exports = router;


