const pageIndicator = document.getElementById('checkout');
const bookingSearch = document.getElementById('bookingSearch');
const emailAddress = document.getElementById('email');
const custName = document.getElementById('name');
const dynamicContent = document.getElementById('dynamicContent');
pageIndicator.classList.add('active');



bookingSearch.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    var obj = {
        email: emailAddress.value,
        name: custName.value
    }
    const params = JSON.stringify(obj);
    const response = await axios.post(`${window.location.origin}/hotel/admin/receptionist/data/checkIns`, params, { headers: { 'Content-Type': 'application/json' } });
    setUpDynamicContent(response.data);
});


function setUpDynamicContent(data) {
    dynamicContent.innerHTML = data;
    var processBooking = document.getElementById('processBooking');
    processBooking.addEventListener('click', (event) => {
        console.log('clicked');
    });
}