const checkExtension = document.getElementById('checkExtension');
const dayCount = document.getElementById('extendDays');
const submitExtension = document.getElementById('extendSub');
const cancel = document.getElementById('cancel');
const bookingID = document.getElementById('bookingID');
const displayTxt = document.getElementById('displayTxt');
const modalDynamicContent = document.getElementById('dynamicContent');
const modalTrigger = document.getElementById('modalTrigger');

submitExtension.style.display = 'none';
cancel.style.display = 'none';

checkExtension.addEventListener('click', async (event) => {
    var obj = {
        days: dayCount.value,
        id: bookingID.getAttribute('data-bookingID')
    }
    var params = JSON.stringify(obj);
    const response = await axios.post('http://localhost:3000/hotel/admin/receptionist/data/extensions', params, { headers: { 'Content-Type': 'application/json' } });
    if (response.data.status) {
        console.log("Hello");
        submitExtension.style.display = '';
        cancel.style.display = '';
        displayTxt.classList.add('text-success');
        displayTxt.innerText = 'Extension Possible';
    } else {
        cancel.style.display = '';
        displayTxt.classList.add('text-danger');
        displayTxt.innerText = 'Cannot Extend the Stay. (Some or all the rooms are booked)';
    }
});

submitExtension.addEventListener('click', async (event) => {
    var obj = {
        days: dayCount.value,
        id: bookingID.getAttribute('data-bookingID')
    }
    var params = JSON.stringify(obj);
    const response = await axios.post('http://localhost:3000/hotel/admin/receptionist/extensions', params, { headers: { 'Content-Type': 'application/json' } });
    modalDynamicContent.innerHTML = response.data;
    modalTrigger.click();
});

