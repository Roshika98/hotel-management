const isCustAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/hotel/customer/auth');
    }
}

const isReceptionistAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.empType == 'receptionist') {
            next();
        } else {
            res.redirect('/hotel/admin/auth');
        }
    } else {
        res.redirect('/hotel/admin/auth');
    }
}

const isManagerAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.empType == 'manager') {
            next();
        } else {
            res.redirect('/hotel/admin/auth');
        }
    } else {
        res.redirect('/hotel/admin/auth');
    }
}

module.exports = { isCustAuthenticated, isReceptionistAuth, isManagerAuth };