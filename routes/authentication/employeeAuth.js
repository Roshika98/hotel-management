const express = require('express');
const router = express.Router();
const passport = require('passport');
const Employee = require('../../models/employee');


router.get('', (req, res) => {
    res.render('admin/login', { layout: false });
});

router.get('/success', (req, res) => {
    console.log('Success came');
    if (req.isAuthenticated()) {
        console.log('inside success');
        console.log(req.user);
        if (req.user.empType === 'receptionist')
            res.redirect('/hotel/admin/receptionist');
        else res.redirect('/hotel/admin/manager');
    }
    else res.redirect('/hotel/admin/auth');
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        req.session.destroy();
        res.redirect('/hotel/admin/auth');
    });
});


router.post('/signup', async (req, res) => {
    var { email, password } = req.body;
    console.log(email + " " + password);
    const employee = new Employee({ email: email });
    const newEmployee = await Employee.register(employee, password);
    console.log(newEmployee);
    res.redirect('/hotel/admin/auth'); // TODO--- when a new user is created redirect accordingly
});




router.post('', passport.authenticate('employee', { failureRedirect: '/hotel/admin/auth' }), (req, res) => {
    // console.log(req.body);
    res.redirect('/hotel/admin/auth/success');
});

module.exports = router;