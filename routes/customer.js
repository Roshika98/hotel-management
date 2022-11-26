const express = require('express');
const router = express.Router();
const authSubRoutes = require('./customerAuthSubRoutes');
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

router.use('/auth', authSubRoutes);

router.get('', (req, res) => {
    const user = checkUserAuth(req);
    res.render('customer/partials/welcomePage', { layout: custLayout, script: '', user });
});

router.get('/bookings', async (req, res) => {
    const user = checkUserAuth(req);
    const params = req.query;
    if (Object.keys(params).length > 0) {
        const availableRooms = await database.getAvailableRooms(params.checkIn, params.checkOut);
        const deluxeDouble = await database.getDeluxeRoomDetails();
        const superiorDouble = await database.getSuperiorRoomDetails();
        const deluxeFamily = await database.getFamilyRoomDetails();
        // console.log(result);
        res.render('customer/partials/makeReservation', { layout: custLayout, params, user, availableRooms, deluxeDouble, superiorDouble, deluxeFamily, script: scripts.booking });
    } else
        res.render('customer/partials/bookings', { layout: custLayout, script: scripts.dateReserve, user });
});

router.get('/payments/userinfo', async (req, res) => {
    const user = checkUserAuth(req);
    const reserveData = await database.getTempReserveData(req.sessionID);
    if (reserveData !== null) {
        const paymentInfo = await bookingUtil.estimatePayment(reserveData);
        // console.log(paymentInfo);
        res.render('customer/partials/makeRoomPayment', { layout: custLayout, script: scripts.paymentRoom, user, paymentInfo });
    } else
        res.redirect('/hotel/customer/bookings');
});

router.get('/payments/details/:id', async (req, res) => {
    const user = checkUserAuth(req);
    const id = req.params.id;
    // TODO---------- get the booking details from database to get the advance payment amount----
    res.render('customer/partials/acceptPayment', { layout: custLayout, script: scripts.paymentProcess, id, user });
});

router.get('/payments/confirmation/:id', async (req, res) => {
    const user = checkUserAuth(req);
    const bookingID = req.params.id;
    const paymentID = req.query.payment_intent;
    const update = await database.confirmAdvancePayment(bookingID, paymentID);
    res.render('customer/partials/paymentSuccess', { layout: custLayout, script: '', user });
});

router.get('/about/rooms', (req, res) => {
    const user = checkUserAuth(req);
    res.render('customer/partials/roomInfo', { layout: custLayout, script: '', user });
});

router.get('/about/halls', (req, res) => {
    const user = checkUserAuth(req);
    res.render('customer/partials/hallInfo', { layout: custLayout, script: '', user });
});

router.get('/termsconditions', (req, res) => {
    const user = checkUserAuth(req);
    res.render('customer/partials/termsConditions', { layout: custLayout, script: '', user });
});

router.get('/config', (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

router.get('/create-payment-intent/:id', async (req, res) => {
    const id = req.params.id;
    const booking = await database.getBookingDetails(id);
    // console.log(booking);
    const paymentIntent = await payment.createAPaymentIntent(booking);
    res.send({ clientSecret: paymentIntent.client_secret });
});

router.get('/signup', (req, res) => {
    const user = checkUserAuth(req);
    res.render('customer/signUp', { layout: custLayout, script: '', user });
});


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



function checkUserAuth(req) {
    var user = null;
    if (req.isAuthenticated()) {
        user = req.user;
    }
    return user;
}

module.exports = router;


