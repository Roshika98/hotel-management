document.addEventListener('DOMContentLoaded', async () => {
    // Load the publishable key from the server. The publishable key
    // is set in your .env file.
    const { publishableKey } = await fetch('/hotel/customer/config').then((r) => r.json());
    if (!publishableKey) {
        alert('Please set your Stripe publishable API key in the .env file');
    }

    const stripe = Stripe(publishableKey, {
        apiVersion: '2020-08-27',
    });

    // On page load, we create a PaymentIntent on the server so that we have its clientSecret to
    // initialize the instance of Elements below. The PaymentIntent settings configure which payment
    // method types to display in the PaymentElement.
    const id = document.getElementById('idholder').getAttribute('data-bookingID');
    const {
        error: backendError,
        clientSecret
    } = await fetch(`/hotel/customer/create-payment-intent/${id}`).then(r => r.json());
    if (backendError) {
        console.log(backendError.message);
    }
    console.log(`Client secret returned.`);

    // Initialize Stripe Elements with the PaymentIntent's clientSecret,
    // then mount the payment element.
    const elements = stripe.elements({ clientSecret });
    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');

    // When the form is submitted...
    const form = document.getElementById('payment-form');
    let submitted = false;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable double submission of the form
        if (submitted) { return; }
        submitted = true;
        form.querySelector('button').disabled = true;

        const nameInput = document.querySelector('#name');

        // Confirm the card payment given the clientSecret
        // from the payment intent that was just created on
        // the server.
        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `http://localhost:3000/hotel/customer/payments/confirmation/${id}`,
            }
        });

        if (stripeError) {
            addMessage(stripeError.message);

            // reenable the form.
            submitted = false;
            form.querySelector('button').disabled = false;
            return;
        }
    });
});
