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

router.get('/myAccount', async (req, res) => {
    if (checkUserAuth(req)) {
        const user = await database.getUserInfo(req.user.id);
        console.log(user);
        res.render('customer/partials/myAccount', { layout: custLayout, script: '', user });
    } else
        res.redirect('/hotel/customer/auth');
});

router.get('/myReservations', async (req, res) => {
    if (checkUserAuth(req)) {
        const reservations = await database.getAllReservationsForUser(req.user);
        var user = checkUserAuth(req);
        console.log(reservations);
        res.render('customer/partials/myReservations', { layout: custLayout, script: '', user, reservations });
    } else {
        res.redirect('/hotel/customer/auth');
    }
});

router.get('/bookings', async (req, res) => {
    const user = checkUserAuth(req);
    const params = req.query;
    if (Object.keys(params).length > 0) {
        const availableRooms = await database.getAvailableRooms(params.checkIn, params.checkOut);
        const deluxeDouble = await database.getDeluxeRoomDetails();
        const superiorDouble = await database.getSuperiorRoomDetails();
        const deluxeFamily = await database.getFamilyRoomDetails();
        res.render('customer/partials/makeReservation', { layout: custLayout, params, user, availableRooms, deluxeDouble, superiorDouble, deluxeFamily, script: scripts.booking });
    } else
        res.render('customer/partials/bookings', { layout: custLayout, script: scripts.dateReserve, user });
});

router.get('/bookings/discards', async (req, res) => {
    await database.deleteTempReserveData(req.sessionID);
    res.redirect('/hotel/customer/bookings');
});

router.get('/payments/userinfo', async (req, res) => {
    const user = checkUserAuth(req);
    const reserveData = await database.getTempReserveData(req.sessionID);
    if (reserveData !== null) {
        const paymentInfo = await bookingUtil.estimatePayment(reserveData);
        res.render('customer/partials/makeRoomPayment', { layout: custLayout, script: scripts.paymentRoom, user, paymentInfo });
    } else
        res.redirect('/hotel/customer/bookings');
});

router.get('/payments/details/:id', async (req, res) => {
    const user = checkUserAuth(req);
    const id = req.params.id;
    const price = await database.getAdvanceAmount(id);
    console.log('$ ' + price);
    res.render('customer/partials/acceptPayment', { layout: custLayout, script: scripts.paymentProcess, id, user, price });
});

router.get('/payments/confirmation/:id', async (req, res) => {
    const user = checkUserAuth(req);
    const bookingID = req.params.id;
    const paymentID = req.query.payment_intent;
    const confirmBooking = await bookingUtil.confirmBooking(bookingID, paymentID);
    const deleteTempData = await bookingUtil.discardBooking(bookingID, req.sessionID);
    res.render('customer/partials/paymentSuccess', { layout: custLayout, script: '', user });
});

router.get('/payment/time', async (req, res) => {
    const timerData = await bookingUtil.getRemainingTimePayment(req.sessionID);
    res.send({ timerVal: timerData });
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
    const booking = await database.getTemporaryBookingDetail(id);
    const paymentIntent = await payment.createAPaymentIntent(booking);
    res.send({ clientSecret: paymentIntent.client_secret, paymentID: paymentIntent.id, reserveID: id });
});

router.get('/signup', (req, res) => {
    const user = checkUserAuth(req);
    res.render('customer/signUp', { layout: custLayout, script: '', user });
});


// *-----------------------POST REQUESTS-------------------------

router.post('/myAccount/update/:id', async (req, res) => {
    const result = await database.updateUserProfile(req.user.id, req.body);
    res.redirect('/hotel/customer/myAccount');
});

router.post('/bookings/rooms', async (req, res) => {
    const basicDetails = req.body;
    const tempHolder = await database.createTempReserveData(req.sessionID, basicDetails);
    console.log(tempHolder);
    const user = checkUserAuth(req);
    if (req.isAuthenticated() && user.address && user.mobile) {
        const reserveData = await database.getTempReserveData(req.sessionID);
        const booking = await bookingUtil.createBooking(reserveData, {}, req.sessionID, user);
        await database.createPaymentTimerData(req.sessionID);
        res.send(`/hotel/customer/payments/details/${booking}`)
    } else {
        res.send('/hotel/customer/payments/userinfo');
    }
});

router.post('/reservations/rooms', async (req, res) => {
    const reserveData = await database.getTempReserveData(req.sessionID);
    var booking = null;
    if (req.isAuthenticated()) {
        console.log(req.isAuthenticated());
        booking = await bookingUtil.createBooking(reserveData, req.body, req.sessionID, req.user);
    } else
        booking = await bookingUtil.createBooking(reserveData, req.body, req.sessionID);
    await database.createPaymentTimerData(req.sessionID);
    res.redirect(`/hotel/customer/payments/details/${booking}`);
});

router.post('/payments/cancel/:id', async (req, res) => {
    const bookingID = req.params.id;
    var cancelation = await bookingUtil.discardBooking(bookingID, req.sessionID);
    var cancelPayment = await payment.cancelPaymentIntent(req.body.paymentIntentID);
    console.log(bookingID);
    console.log(req.body.paymentIntentID);
    res.sendStatus(200);
});



function checkUserAuth(req) {
    var user = null;
    if (req.isAuthenticated()) {
        user = req.user;
    }
    return user;
}

module.exports = router;


