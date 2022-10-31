const express = require('express');
const router = express.Router();
const auth = require('./authentication');
const employee = require('./Employee');
const authMiddleware = require('../middleware/authenticationCheck');


router.use('/auth', auth.employeeAuth);
router.use('/receptionist', authMiddleware.isReceptionistAuth, employee.receptionist);
router.use('/manager', authMiddleware.isManagerAuth, employee.manager);


// router.get('', (req, res) => {
//     res.render('admin/adminLayout', { layout: false });
// });



module.exports = router;