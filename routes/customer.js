const express = require('express');
const router = express.Router();
const auth = require('./authentication');
const database = require('../database/database');

const custLayout = 'customer/layout';

// router.use('/auth/google', auth.googleAuth);
// router.use('/auth/local', auth.localAuth);
// router.use('/auth/facebook', auth.facebookAuth);
// router.use('/auth/twitter', auth.twitterAuth);

router.get('', (req, res) => {
    res.render('customer/partials/welcomePage', { layout: custLayout });
});

router.get('/bookings', (req, res) => {
    res.render('customer/partials/bookings', { layout: custLayout });
});

router.get('/reservation', async (req, res) => {
    const params = req.query;
    console.log(params);
    const result = await database.getAvailableRooms(params.checkIn, params.checkOut);
    console.log(result);
    res.send("Hello");
});

// router.get('/auth', (req, res) => {
//     res.render('customer/partials/login', { layout: custLayout });
// });

// router.get('/signup', (req, res) => {
//     res.render('customer/signUp', { layout: custLayout });
// });

// router.get('/auth/logout', (req, res) => {
//     req.logout((err) => {
//         req.session.destroy();
//         res.send('user logged out');
//     });
// });

module.exports = router;


