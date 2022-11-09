const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
});

class Payment {

    constructor() {

    }

    async createAPaymentIntent() {
        const customer = await stripe.customers.create({
            name: 'Jenny Rosen',
            description: 'My First Test Customer (created for API docs)',
            address: {
                line1: '510 Townsend St',
                postal_code: '98140',
                city: 'San Francisco',
                state: 'CA',
                country: 'US',
            },
        });
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 2000,
            currency: 'usd',
            payment_method_types: ['card'],
            description: 'Software development services',
            customer: customer.id
        });
        return paymentIntent;
    }
}

module.exports = new Payment();