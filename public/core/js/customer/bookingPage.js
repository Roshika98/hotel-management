
const deluxeRoomCount = document.getElementById('deluxeRoomCount');
const superiorRoomCount = document.getElementById('superiorRoomCount');
const familyRoomCount = document.getElementById('familyRoomCount');
const packageType = document.getElementById('package');
const estimate = document.getElementById('estimatePrice');
const checkInDate = document.getElementById('checkIn');
const checkOutDate = document.getElementById('checkOut');
const checkAvailability = document.getElementById('availabilityCheck');
const proceedReservation = document.getElementById('proceed');
const alertPlaceholder = document.getElementById('alertdiv');

const deluxePrices = [parseInt(deluxeRoomCount.getAttribute('data-standard')), parseInt(deluxeRoomCount.getAttribute('data-halfBoard')), parseInt(deluxeRoomCount.getAttribute('data-fullBoard'))];
const superiorPrices = [parseInt(superiorRoomCount.getAttribute('data-standard')), parseInt(superiorRoomCount.getAttribute('data-halfBoard')), parseInt(superiorRoomCount.getAttribute('data-fullBoard'))];
const familyPrices = [parseInt(familyRoomCount.getAttribute('data-standard')), parseInt(familyRoomCount.getAttribute('data-halfBoard')), parseInt(familyRoomCount.getAttribute('data-fullBoard'))];

var estimatedPrice = 0;
setEstimatedValue();
var minDate = new Date();
minDate.setDate(minDate.getDate() + 1);
var maxDate = new Date();
maxDate.setDate(minDate.getDate() + 60);
checkInDate.setAttribute('min', minDate.toISOString().split('T')[0]);
checkInDate.setAttribute('max', maxDate.toISOString().split('T')[0]);
setMinCheckOutDate();


proceedReservation.addEventListener('click', async (event) => {
    if (superiorRoomCount.value + familyRoomCount.value + deluxeRoomCount.value <= 0) {
        alert("you haven't selected any room!", 'warning');
    } else {
        const params = JSON.stringify(getReservationBasicDetails());
        const response = await axios.post(`${window.location.origin}/hotel/customer/bookings/rooms`, params, { headers: { 'Content-Type': 'application/json', } });
        window.location = `${window.location.origin}` + `${response.data}`;
    }
});


deluxeRoomCount.addEventListener('input', (event) => {
    calculatePrice();
});

superiorRoomCount.addEventListener('input', (event) => {
    calculatePrice();
});

familyRoomCount.addEventListener('input', (event) => {
    calculatePrice();
});

packageType.addEventListener('input', (event) => {
    calculatePrice();
});

checkInDate.addEventListener('input', (event) => {
    var currCheckOut = new Date(checkOutDate.value);
    var currCheckIn = new Date(checkInDate.value);
    if (currCheckIn >= currCheckOut) {
        checkOutDate.removeEventListener('input', reCheckAvailability);
        currCheckIn.setDate(currCheckIn.getDate() + 1);
        checkOutDate.value = currCheckIn.toISOString().split('T')[0];
    }
    checkAvailability.click();
});

checkOutDate.addEventListener('input', reCheckAvailability);



function setMinCheckOutDate() {
    var dateValue = new Date(checkInDate.value);
    dateValue.setDate(dateValue.getDate() + 1);
    checkOutDate.setAttribute('min', dateValue.toISOString().split('T')[0]);
    checkOutDate.setAttribute('max', maxDate.toISOString().split('T')[0]);
}

function setEstimatedValue() {
    estimate.innerText = estimatedPrice;
}


function reCheckAvailability() {
    checkAvailability.click();
}

function calculatePrice() {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(checkInDate.value);
    const secondDate = new Date(checkOutDate.value);
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    console.log(diffDays);
    var price = 0;
    price += deluxeRoomCount.value * deluxePrices[packageType.value];
    price += superiorRoomCount.value * superiorPrices[packageType.value];
    price += familyRoomCount.value * familyPrices[packageType.value];
    estimatedPrice = price * diffDays;
    setEstimatedValue();
}

function getReservationBasicDetails() {
    var params = {
        checkIn: checkInDate.value,
        checkOut: checkOutDate.value,
        deluxe: deluxeRoomCount.value,
        superior: superiorRoomCount.value,
        family: familyRoomCount.value,
        package: packageType.value,
        adults: document.getElementById('adults').value,
        children: document.getElementById('children').value
    }
    return params;
}

function alert(message, type) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

    alertPlaceholder.append(wrapper)
}

