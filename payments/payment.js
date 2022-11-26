const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
});

class Payment {

    constructor() {

    }

    async createAPaymentIntent(data) {
        const customer = await stripe.customers.create({
            name: data.user.name,
            description: 'My First Test Customer (created for API docs)',
            address: {
                line1: data.user.address.line1,
                postal_code: data.user.address.postal_code,
                city: data.user.address.city,
                state: data.user.address.state,
                country: data.user.address.country,
            },
        });
        console.log(customer);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(data.advance) * 100,
            currency: 'usd',
            payment_method_types: ['card'],
            description: 'Advance payment for room reservation',
            customer: customer.id
        });
        // console.log(paymentIntent);
        return paymentIntent;
    }
}

module.exports = new Payment();