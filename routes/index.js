const adminRoutes = require('./admin');
const customerRoutes = require('./customer');

const Router = {
    admin: adminRoutes,
    customer: customerRoutes
}


module.exports = Router;