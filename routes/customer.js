const express = require('express');
const router = express.Router();
const auth = require('./authentication');
const database = require('../database/database');
const bookingUtil = require('../utility/bookingUtility');

const custLayout = 'customer/layout';

const scripts = {
    booking: '/core/js/customer/bookingPage.js',
    paymentRoom: '/core/js/customer/paymentPage.js'
}

// router.use('/auth/google', auth.googleAuth);
// router.use('/auth/local', auth.localAuth);
// router.use('/auth/facebook', auth.facebookAuth);
// router.use('/auth/twitter', auth.twitterAuth);

router.get('', (req, res) => {
    res.render('customer/partials/welcomePage', { layout: custLayout, script: '' });
});

router.get('/bookings', async (req, res) => {
    const params = req.query;
    if (Object.keys(params).length > 0) {
        const availableRooms = await database.getAvailableRooms(params.checkIn, params.checkOut);
        const deluxeDouble = await database.getDeluxeRoomDetails();
        const superiorDouble = await database.getSuperiorRoomDetails();
        const deluxeFamily = await database.getFamilyRoomDetails();
        // console.log(result);
        res.render('customer/partials/makeReservation', { layout: custLayout, params, availableRooms, deluxeDouble, superiorDouble, deluxeFamily, script: scripts.booking });

    } else
        res.render('customer/partials/bookings', { layout: custLayout, script: '' });
});

router.get('/payments/rooms', async (req, res) => {
    if (req.session.basicRoomReserveData && req.session.basicRoomReserveData !== null && req.session.basicRoomReserveData !== 'undefined') {
        const paymentInfo = await bookingUtil.estimatePayment(req.session.basicRoomReserveData);
        // console.log(paymentInfo);
        res.render('customer/partials/makeRoomPayment', { layout: custLayout, script: scripts.paymentRoom, paymentInfo });
    } else
        res.redirect('/hotel/customer/bookings');
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


// *-----------------------POST REQUESTS-------------------------


router.post('/bookings/rooms', async (req, res) => {
    // console.log(req.body);
    const basicDetails = req.body;
    req.session.basicRoomReserveData = basicDetails;
    req.session.save(() => {
        res.sendStatus(200);
    });
});

router.post('/reservations/rooms', async (req, res) => {
    console.log(req.body);
    console.log(req.session.basicRoomReserveData);
    const booking = await bookingUtil.createBooking(req.session.basicRoomReserveData, req.body);
    req.session.destroy(() => {
        res.sendStatus(200);
    })
    // res.send('boom');
});

module.exports = router;


