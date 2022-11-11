const steps = document.getElementsByTagName('fieldset');
const listItems = document.getElementsByClassName('items');
const nextBtns = document.getElementsByClassName('next');
const prevBtns = document.getElementsByClassName('previous');
const submit = document.getElementById('submit');
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");
btn.style.display = 'none';
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// * PAYMENT VARIABLES---------------------------



// var index = 0;
// listItems[index].classList.add('active');
// multiStepForm();

// for (let i = 0; i < nextBtns.length; i++) {
//     const element = nextBtns[i];
//     element.addEventListener('click', (event) => {
//         index += 1;
//         listItems[index].classList.add('active');
//         multiStepForm();
//     });
// }

// for (let i = 0; i < prevBtns.length; i++) {
//     const element = prevBtns[i];
//     element.addEventListener('click', (event) => {
//         index -= 1;
//         listItems[index + 1].classList.remove('active');
//         multiStepForm();
//     });
// }

// function multiStepForm() {
//     for (let i = 0; i < steps.length; i++) {
//         const element = steps[i];
//         if (i == index) {
//             element.style.display = 'initial';
//         } else {
//             element.style.display = 'none';
//         }
//     }
// }

function getFormData() {
    var obj = {
        fname: document.getElementById('fname').value,
        lname: document.getElementById('lname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    }
    return obj
}

submit.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const params = JSON.stringify(getFormData());
    const response = await axios.post(`${window.location.origin}/hotel/customer/reservations/rooms`, params, { headers: { 'Content-Type': 'application/json', } });
    window.location = `${window.location.origin}/hotel/customer/payments/details/${response.data}`;
    // btn.click();
});



// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
    window.location = 'http://localhost:3000/hotel/customer/bookings';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        window.location = 'http://localhost:3000/hotel/customer/bookings';
    }
}



