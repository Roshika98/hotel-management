const googleAuth = require('./googleAuth');
const localAuth = require('./localAuth');
const facebookAuth = require('./facebookAuth');
const twitterAuth = require('./twitterAuth');

const authenticationRoutes = {
    googleAuth: googleAuth,
    localAuth: localAuth,
    facebookAuth: facebookAuth,
    twitterAuth: twitterAuth
}

module.exports = authenticationRoutes;