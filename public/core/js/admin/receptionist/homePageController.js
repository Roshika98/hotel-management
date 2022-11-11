const bookingSearch = document.getElementById('bookingSearch');
const emailAddress = document.getElementById('email');
const custName = document.getElementById('name');
const dynamicContent = document.getElementById('dynamicContent');
const pageIndicator = document.getElementById('checkin');
pageIndicator.classList.add('active');

// *-----------HALLS----------------------------
const hallCheck = document.getElementById('hallCheck');
const reserveDate = document.getElementById('reserveDate');
const hallType = document.getElementById('hall');
const orderContent = document.getElementById('orderContent');
const txtDisplay = document.getElementById('txtDisplay');

orderContent.style.display = 'none';
txtDisplay.style.display = 'none';

bookingSearch.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    var obj = {
        email: emailAddress.value,
        name: custName.value
    }
    const params = JSON.stringify(obj);
    const response = await axios.post(`${window.location.origin}/hotel/admin/receptionist/data/bookings`, params, { headers: { 'Content-Type': 'application/json' } });
    setUpDynamicContent(response.data);
});


function setUpDynamicContent(data) {
    dynamicContent.innerHTML = data;
    var processBooking = document.getElementById('processBooking');
    processBooking.addEventListener('click', (event) => {
        console.log('clicked');
    });
}


hallCheck.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    var obj = {
        reserveDate: reserveDate.value,
        hall: parseInt(hall.value)
    };
    var params = JSON.stringify(obj);
    const response = await axios.post(`${window.location.origin}/hotel/admin/receptionist/data/hallChecks`, params, { headers: { 'Content-Type': 'application/json' } });
    console.log(response.data.status);
    if (response.data.status) {
        txtDisplay.style.display = 'none';
        orderContent.style.display = '';
    } else {
        txtDisplay.style.display = '';
        orderContent.style.display = 'none';
    }
});