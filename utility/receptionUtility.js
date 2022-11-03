const database = require('../database/database');


class ReceptionUtility {

    constructor() {

    }

    async extendCustomerStay(bookingID, count) {
        const booking = await database.getBookingDetails(bookingID);
        var checkOutDate = new Date(booking.checkOut);
        var extendedDate = new Date(booking.checkOut);
        extendedDate.setDate(extendedDate.getDate() + parseInt(count));
        const rooms = [];
        for (let i = 0; i < booking.roomNumbers.length; i++) {
            const element = booking.roomNumbers[i];
            rooms.push(element._id);
        }
        const result = await database.checkRoomAvailabilityToExtend(rooms, checkOutDate, extendedDate);
        if (result.length > 0) {
            console.log('cannot extend the stay :(');
        } else {
            console.log('Can extend the stay :)');
        }
    }


    async getAllBookingsToDisplay() {
        var dueToday = await database.getBookingsDueToday();
        var future = await database.getFutureBookings();
        var past = await database.getCheckedOutBookings();
        var current = await database.getCheckedInBookings();
        var obj = {
            present: dueToday,
            future: future,
            past: past,
            checkedIn: current
        }
        return obj;
    }


}

module.exports = new ReceptionUtility();