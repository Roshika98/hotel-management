const express = require('express');
const database = require('../../database/database');
const router = express.Router();
const adminLayout = 'admin/adminLayout';

const scripts = {
    homepage: '/core/js/admin/receptionist/homePageController.js',
    checkin: '',
    checkout: '/core/js/admin/receptionist/checkoutPageController.js'
}

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

router.post('/checkIn/:id', async (req, res) => {
    var id = req.params.id;
    const result = await database.updateCheckInStatus(id);
    res.redirect('/hotel/admin/receptionist');
});

router.post('/checkouts/:id', async (req, res) => {
    const result = await database.performCheckout(req.params.id);
    res.redirect('/hotel/admin/receptionist/checkouts');
});

module.exports = router;

function getEmployeeDetails(req) {
    return req.user.empType;
}
