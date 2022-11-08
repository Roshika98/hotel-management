const express = require('express');
const router = express.Router();
const adminLayout = 'admin/adminLayout';

const scripts = {
    chart: '/core/js/admin/manager/chartController.js',
    stats: '/core/js/admin/manager/statController.js'
}

router.get('', (req, res) => {
    res.send("Hello this is manager");
});

router.get('/home', (req, res) => {
    const empType = getEmployeeDetails(req);
    res.render('admin/partials/manager/chartview', { layout: adminLayout, empType, script: scripts.chart });
});

router.get('/statistics', (req, res) => {
    const empType = getEmployeeDetails(req);
    res.render('admin/partials/manager/statview', { layout: adminLayout, empType, script: scripts.stats });
});

module.exports = router;

function getEmployeeDetails(req) {
    return req.user.empType;
}
