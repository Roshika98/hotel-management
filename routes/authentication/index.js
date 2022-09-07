const googleAuth = require('./googleAuth');
const localAuth = require('./localAuth');

const authenticationRoutes = {
    googleAuth: googleAuth,
    localAuth: localAuth
}

module.exports = authenticationRoutes;