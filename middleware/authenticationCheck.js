const isCustAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/hotel/customer/auth');
    }
}

module.exports = { isCustAuthenticated };