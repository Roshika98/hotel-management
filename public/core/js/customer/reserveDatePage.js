const checkInDate = document.getElementById('checkIn');
const checkOutDate = document.getElementById('checkOut');

checkOutDate.disabled = true;
checkInDate.setAttribute('min', new Date().toISOString().split('T')[0]);
// setMinCheckOutDate();


checkInDate.addEventListener('input', (event) => {
    if (checkOutDate.disabled) checkOutDate.disabled = false;
    var currCheckOut = new Date(checkOutDate.value);
    var currCheckIn = new Date(checkInDate.value);
    if (currCheckIn >= currCheckOut) {
        currCheckIn.setDate(currCheckIn.getDate() + 1);
        checkOutDate.setAttribute('min', currCheckIn.toISOString().split('T')[0]);
        checkOutDate.value = currCheckIn.toISOString().split('T')[0];
    } else {
        currCheckIn.setDate(currCheckIn.getDate() + 1);
        checkOutDate.setAttribute('min', currCheckIn.toISOString().split('T')[0]);
        if (!checkOutDate.value) {
            checkOutDate.value = currCheckIn.toISOString().split('T')[0];
        }
    }
});


