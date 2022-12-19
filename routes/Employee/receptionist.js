const express = require('express');
const database = require('../../database/database');
const router = express.Router();
const receptionUtil = require('../../utility/receptionUtility');

const adminLayout = 'admin/adminLayout';

const scripts = {
    homepage: '/core/js/admin/receptionist/homePageController.js',
    checkin: '',
    checkout: '/core/js/admin/receptionist/checkoutPageController.js',
    booking: '/core/js/admin/receptionist/bookingViewController.js',
    cancellation: '/core/js/admin/receptionist/cancellationController.js',
    extension: '/core/js/admin/receptionist/extensionController.js'
}

// router.use('/reports', reports);

router.get('', (req, res) => {
    // res.send("Hello this is receptionist");
    const empType = getEmployeeDetails(req);
    res.render('admin/partials/receptionist/homepage', { layout: adminLayout, empType, script: scripts.homepage });
});

router.get('/reservation/:id', async (req, res) => {
    const id = req.params.id;
    const empType = getEmployeeDetails(req);
    const reservation = await database.getBookingDetails(id);
    res.render('admin/partials/receptionist/processCheckin', { layout: adminLayout, empType, script: scripts.checkin, reservation });
});

router.get('/checkouts', async (req, res) => {
    const empType = getEmployeeDetails(req);
    const checkedIns = await database.getCheckedInCustomers();
    res.render('admin/partials/receptionist/checkouts', { layout: adminLayout, empType, script: scripts.checkout, checkedIns });
});

router.get('/checkouts/:id', async (req, res) => {
    const empType = getEmployeeDetails(req);
    const checkedIn = await database.getCheckedInCustomer(req.params.id);
    res.render('admin/partials/receptionist/processCheckout', { layout: adminLayout, empType, script: '', checkedIn });
});


router.get('/checkouts/discount/:id', async (req, res) => {
    const updateData = await receptionUtil.applyDiscount(req.params.id);
    res.redirect('/hotel/admin/receptionist/checkouts/' + req.params.id);
});

router.get('/bookings', async (req, res) => {
    const empType = getEmployeeDetails(req);
    const bookings = await receptionUtil.getAllBookingsToDisplay();
    res.render('admin/partials/receptionist/bookings', { layout: adminLayout, empType, script: scripts.booking, bookings });
});

router.get('/bookings/:id', async (req, res) => {
    const empType = getEmployeeDetails(req);
    const booking = await database.getBookingDetails(req.params.id);
    res.render('admin/partials/receptionist/viewBookingInfo', { layout: adminLayout, empType, script: '', booking });
});

router.get('/userInfo/:id', async (req, res) => {
    const user = await database.getUserInfo(req.params.id);
    res.render('admin/partials/receptionist/content/userDetails', { layout: false, user });
});

router.get('/cancellations', async (req, res) => {
    const empType = getEmployeeDetails(req);
    const cancellations = await database.getCancelledBookings();
    res.render('admin/partials/receptionist/cancellations', { layout: adminLayout, empType, script: scripts.cancellation, cancellations });
});


router.get('/cancellations/:id', async (req, res) => {
    const empType = getEmployeeDetails(req);
    const cancelation = await database.getBookingDetails(req.params.id);
    res.render('admin/partials/receptionist/processCancellation', { layout: adminLayout, empType, script: '', cancelation });
});


router.get('/extensions/:id', async (req, res) => {
    // TODO perform extending customer stay
    const empType = getEmployeeDetails(req);
    const details = await database.getBookingDetails(req.params.id);
    res.render('admin/partials/receptionist/processExtensions', { layout: adminLayout, empType, script: scripts.extension, details });
});


// router.get('/extend', async (req, res) => {
//     const result = await receptionUtil.extendCustomerStay('635e2abd07a215f10f9fded9', 2);
//     res.send("heloo");
// });

// router.get('/test', async (req, res) => {
//     const data = await database.getMonthlyHallStatus();
//     res.send('done');
// });




// *-----------------------------POST REQUESTS--------------------------



router.post('/data/bookings', async (req, res) => {
    console.log(req.body);
    const details = await database.getBookingDetails(req.body.email, req.body.name);
    res.render('admin/partials/receptionist/content/bookingDetails', { layout: false, details });
});

router.post('/data/checkIns', async (req, res) => {
    const details = await database.getCheckedInCustomer(req.body.email, req.body.name);
    res.render('admin/partials/receptionist/content/checkInDetails', { layout: false, details });
});

router.post('/data/cancelations', async (req, res) => {
    const details = await database.getBookingToCancel(req.body.email);
    res.render('admin/partials/receptionist/content/cancelationDetails', { layout: false, details });
});

router.post('/data/extensions', async (req, res) => {
    const result = await receptionUtil.extendCustomerStay(req.body.id, req.body.days);
    res.send({ status: result });
});

router.post('/checkIn/:id', async (req, res) => {
    var id = req.params.id;
    const result = await database.updateCheckInStatus(id);
    res.redirect('/hotel/admin/receptionist');
});

router.post('/checkouts/:id', async (req, res) => {
    const result = await database.performCheckout(req.params.id);
    const loyalty = await receptionUtil.applyLoyalty(req.params.id);
    res.redirect('/hotel/admin/receptionist/checkouts');
});

router.post('/cancellations/:id', async (req, res) => {
    const result = await database.cancelBooking(req.params.id);
    res.redirect('/hotel/admin/receptionist/cancellations');
});

router.post('/extensions', async (req, res) => {
    const result = await receptionUtil.performCustomerExtension(req.body.id, req.body.days);
    res.render('admin/partials/receptionist/content/extendDetails', { layout: false, result });
});

// !---------------------HALL OPERATIONS-------------------------------------

router.post('/data/hallChecks', async (req, res) => {
    console.log(req.body);
    var status = null;
    if (req.body.hall === 0) {
        status = await database.checkHallAvailability('Grown Banquet Hall', req.body.reserveDate);
    } else {
        status = await database.checkHallAvailability('Master Banquet Hall', req.body.reserveDate);
    }
    res.send({ status: status });
});

router.post('/hallReservations', async (req, res) => {
    console.log(req.body);
    const result = await receptionUtil.createHallBooking(req.body);
    res.redirect('/hotel/admin/receptionist');
});






module.exports = router;

function getEmployeeDetails(req) {
    return req.user.empType;
}
