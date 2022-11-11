const userInfoBtns = document.getElementsByClassName('userinfo');
const modalTrigger = document.getElementById('modalTrigger');
const dynamicContent2 = document.getElementById('dynamicContent2');
const bookingSearch = document.getElementById('bookingSearch');
const emailAddress = document.getElementById('email');
const custName = document.getElementById('name');
const dynamicContent = document.getElementById('dynamicContent');

console.log(userInfoBtns.length);

for (let i = 0; i < userInfoBtns.length; i++) {
    const element = userInfoBtns[i];
    element.addEventListener('click', async (event) => {
        var id = element.getAttribute('data-userInfo');
        const response = await axios.get(`${window.location.origin}/hotel/admin/receptionist/userInfo/${id}`);
        setUpDynamicContent(response.data);
    });
}


function setUpDynamicContent(data) {
    dynamicContent2.innerHTML = data;
    modalTrigger.click();
}


bookingSearch.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    var obj = {
        email: emailAddress.value,
        name: custName.value
    }
    const params = JSON.stringify(obj);
    const response = await axios.post(`${window.location.origin}/hotel/admin/receptionist/data/cancelations`, params, { headers: { 'Content-Type': 'application/json' } });
    setUpCancelationDynamic(response.data);
});


function setUpCancelationDynamic(data) {
    dynamicContent.innerHTML = data;
    var processBooking = document.getElementById('processBooking');
    processBooking.addEventListener('click', (event) => {
        console.log('clicked');
    });
}

