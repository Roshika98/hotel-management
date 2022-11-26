const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
});
const bookingUtil = require('../utility/bookingUtility');

class Payment {

    constructor() {

    }

    async createAPaymentIntent(data) {
        var customer = null;
        if (data.user.stripeCustID) {
            customer = await stripe.customers.retrieve(data.user.stripeCustID);
        } else {
            customer = await this.#createNewCustomer(data.user);
            await bookingUtil.updateCustomerStripeID(data.user.id, customer.id);
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(data.advance) * 100,
            currency: 'usd',
            payment_method_types: ['card'],
            description: 'Advance payment for room reservation',
            customer: customer.id
        });
        return paymentIntent;
    }

    async #createNewCustomer(data) {
        return await stripe.customers.create({
            name: data.name,
            description: 'SE-project test customer',
            address: {
                line1: data.address.line1,
                postal_code: data.address.postal_code,
                city: data.address.city,
                state: data.address.state,
                country: data.address.country,
            },
            email: data.email
        });
    }
}

module.exports = new Payment();