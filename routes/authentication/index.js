const googleAuth = require('./googleAuth');
const localAuth = require('./localAuth');
const facebookAuth = require('./facebookAuth');

const authenticationRoutes = {
    googleAuth: googleAuth,
    localAuth: localAuth,
    facebookAuth: facebookAuth
}

module.exports = authenticationRoutes;