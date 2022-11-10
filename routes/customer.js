const express = require('express');
const router = express.Router();
const auth = require('./authentication');
const database = require('../database/database');
const bookingUtil = require('../utility/bookingUtility');
const payment = require('../payments/payment');


const custLayout = 'customer/layout';

const scripts = {
    booking: '/core/js/customer/bookingPage.js',
    paymentRoom: '/core/js/customer/paymentPage.js',
    dateReserve: '/core/js/customer/reserveDatePage.js',
    paymentProcess: '/core/js/customer/makePayment.js'
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
        res.render('customer/partials/bookings', { layout: custLayout, script: scripts.dateReserve });
});

router.get('/payments/userinfo', async (req, res) => {
    const reserveData = await database.getTempReserveData(req.sessionID);
    if (reserveData !== null) {
        const paymentInfo = await bookingUtil.estimatePayment(reserveData);
        // console.log(paymentInfo);
        res.render('customer/partials/makeRoomPayment', { layout: custLayout, script: scripts.paymentRoom, paymentInfo });
    } else
        res.redirect('/hotel/customer/bookings');
});

router.get('/payments/details/:id', async (req, res) => {
    const id = req.params.id;
    // TODO---------- get the booking details from database to get the advance payment amount----
    res.render('customer/partials/acceptPayment', { layout: custLayout, script: scripts.paymentProcess, id });
});

router.get('/payments/confirmation/:id', async (req, res) => {
    const bookingID = req.params.id;
    const paymentID = req.query.payment_intent;
    // const update = await database.confirmAdvancePayment(bookingID, paymentID);
    console.log(req.body);
    console.log(req.query);
    res.render('customer/partials/paymentSuccess', { layout: custLayout, script: '' });
});

router.get('/about/rooms', (req, res) => {
    res.render('customer/partials/roomInfo', { layout: custLayout, script: '' });
});

router.get('/about/halls', (req, res) => {
    res.render('customer/partials/hallInfo', { layout: custLayout, script: '' });
});

router.get('/termsconditions', (req, res) => {
    res.render('customer/partials/termsConditions', { layout: custLayout, script: '' });
});

router.get('/config', (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

router.get('/create-payment-intent/:id', async (req, res) => {
    const id = req.params.id;
    const booking = await database.getBookingDetails(id);
    const paymentIntent = await payment.createAPaymentIntent(booking);
    res.send({ clientSecret: paymentIntent.client_secret });
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
    const basicDetails = req.body;
    const tempHolder = await database.createTempReserveData(req.sessionID, basicDetails);
    console.log(tempHolder);
    res.send('done');
});

router.post('/reservations/rooms', async (req, res) => {
    console.log(req.body);
    const reserveData = await database.getTempReserveData(req.sessionID);
    const booking = await bookingUtil.createBooking(reserveData, req.body, req.sessionID);
    res.send(booking);
});





module.exports = router;


