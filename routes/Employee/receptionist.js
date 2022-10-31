const express = require('express');
const database = require('../../database/database');
const router = express.Router();
const adminLayout = 'admin/adminLayout';

const scripts = {
    homepage: '/core/js/admin/receptionist/homePageController.js'
}

router.get('', (req, res) => {
    // res.send("Hello this is receptionist");
    res.render('admin/partials/receptionist/homepage', { layout: adminLayout, script: scripts.homepage });
});













// *-----------------------------POST REQUESTS--------------------------



router.post('/data/bookings', async (req, res) => {
    console.log(req.body);
    const details = await database.getBookingDetails(req.body.email, req.body.name);
    res.render('admin/partials/receptionist/content/bookingDetails', { layout: false, details });
});

module.exports = router;