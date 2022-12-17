const alertPlaceholder = document.getElementById('timeoutalert');
document.addEventListener('DOMContentLoaded', async () => {

    var cancelReserevation = document.getElementById('cancelbooking');
    const timerDisplay = document.getElementById('timer');
    const form = document.getElementById('payment-form');
    var timeoutperiod = 0;
    var currTime = 0;


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
        clientSecret,
        paymentID, reserveID
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

    // Start the timeout period & start countdown
    const { timerVal } = await fetch('/hotel/customer/payment/time').then((r) => r.json());
    console.log(timerVal);
    if (timerVal <= 0) {
        alert('payment timed out. please wait while you are being redirected', 'danger');
        disableFormSubmission();
        await cancelProcedure(paymentID, reserveID);
    }

    timeoutperiod = timerVal;
    currTime = timeoutperiod;

    const countdownID = setInterval(() => {
        currTime -= 1;
        var minutes = Math.trunc(currTime / 60);
        var seconds = currTime % 60;
        var minDisplay = minutes < 10 ? '0' + minutes : minutes;
        var secondsDisplay = seconds < 10 ? '0' + seconds : seconds;
        timerDisplay.innerText = minDisplay + ':' + secondsDisplay;
    }, 1000);

    const timeoutID = setTimeout(async () => {
        console.log('Time out!!!!!!');
        alert('payment timed out. please wait while you are being redirected', 'danger');
        disableFormSubmission();
        clearInterval(countdownID);
        await cancelProcedure(paymentID, reserveID);
    }, timeoutperiod * 1000);


    // setup cancelation
    cancelReserevation.addEventListener('click', async () => {
        disableFormSubmission();
        await cancelProcedure(paymentID, reserveID);
    });

    // When the form is submitted...

    let submitted = false;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable double submission of the form
        if (submitted) { return; }
        submitted = true;
        disableFormSubmission();

        const nameInput = document.querySelector('#name');

        // Confirm the card payment given the clientSecret
        // from the payment intent that was just created on
        // the server.
        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/hotel/customer/payments/confirmation/${id}`,
            }
        });

        if (stripeError) {
            console.log(stripeError.message);
            alert(stripeError.message, 'warning');
            // reenable the form.
            submitted = false;
            form.querySelector('button').disabled = false;
            cancelReserevation.disabled = false;
            return;
        }
    });

    function disableFormSubmission() {
        form.querySelector('button').disabled = true;
        cancelReserevation.disabled = true;
    }
});


function alert(message, type) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div class="alert alert-' + type + '" role="alert">' + message + '</div>'

    alertPlaceholder.append(wrapper)
}


async function cancelProcedure(paymentID, reserveID) {
    var params = JSON.stringify({ paymentIntentID: paymentID });
    var result = await axios.post(`${window.location.origin}/hotel/customer/payments/cancel/${reserveID}`, params, { headers: { 'Content-Type': 'application/json', } });
    window.location = `${window.location.origin}/hotel/customer/bookings`;
}

