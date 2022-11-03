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
            return false;
        } else {
            console.log('Can extend the stay :)');
            return true;
        }
    }


    async performCustomerExtension(bookingID, count) {
        const booking = await database.getBookingDetails(bookingID);
        var checkOutDate = new Date(booking.checkOut);
        checkOutDate.setDate(checkOutDate.getDate() + parseInt(count));
        var currentPayment = booking.total - booking.advance;
        var total = 0;
        const pckg = booking.package.pacakgeType;
        for (let i = 0; i < booking.roomNumbers.length; i++) {
            const element = booking.roomNumbers[i].roomType;
            if (pckg === 'room only') {
                total += element.standardPrice * parseInt(count);
            } else if (pckg === 'Half Board') {
                total += element.halfBoardPrice * parseInt(count);
            } else {
                total += element.fullBoardPrice * parseInt(count);
            }
        }
        const newTotal = currentPayment + total;
        const updatedBooking = await database.extendBooking(bookingID, checkOutDate.toISOString().split('T')[0], newTotal);
        console.log({ previous: currentPayment, now: newTotal });
        return { previous: currentPayment, now: newTotal };
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