const steps = document.getElementsByTagName('fieldset');
const listItems = document.getElementsByClassName('items');
const nextBtns = document.getElementsByClassName('next');
const prevBtns = document.getElementsByClassName('previous');
const submit = document.getElementById('submit');


var index = 0;
listItems[index].classList.add('active');
multiStepForm();

for (let i = 0; i < nextBtns.length; i++) {
    const element = nextBtns[i];
    element.addEventListener('click', (event) => {
        index += 1;
        listItems[index].classList.add('active');
        multiStepForm();
    });
}

for (let i = 0; i < prevBtns.length; i++) {
    const element = prevBtns[i];
    element.addEventListener('click', (event) => {
        index -= 1;
        listItems[index + 1].classList.remove('active');
        multiStepForm();
    });
}

function multiStepForm() {
    for (let i = 0; i < steps.length; i++) {
        const element = steps[i];
        if (i == index) {
            element.style.display = 'initial';
        } else {
            element.style.display = 'none';
        }
    }
}

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
    const response = await axios.post('http://localhost:3000/hotel/customer/reservations/rooms', params, { headers: { 'Content-Type': 'application/json', } });
    window.location = 'http://localhost:3000/hotel/customer/bookings';
});

