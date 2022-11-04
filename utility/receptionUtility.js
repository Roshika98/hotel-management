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

    async createHallBooking(data) {
        var h = null;
        if (data.hall === '0') {
            h = await database.getHall('Grown Banquet Hall');
        } else {
            h = await database.getHall('Master Banquet Hall');
        }
        const newUser = await database.createStandardUser({
            email: data.email,
            mobile: data.mobile,
            address: data.address,
            name: data.fname + ' ' + data.lname,
        });
        var today = new Date();
        var params = {
            hall: h,
            user: newUser,
            bookedDate: today.toISOString().split('T')[0],
            reserveDate: data.reserveDate,
            guestCount: parseInt(data.guests),
            total: parseInt(data.guests) * h.hallType.rate
        }
        const newHallBooking = await database.createHallBooking(params);
        console.log(newHallBooking);
        return newHallBooking.id;
    }


    async getDailyReservationsReport() {
        const dailyBookings = await database.dailyReservationsData();
        var roomCount = 0;
        var halfBoardCount = 0;
        var fullBoardCount = 0;
        var guests = 0;
        for (let i = 0; i < dailyBookings.length; i++) {
            const element = dailyBookings[i];
            roomCount += element.roomCount;
            guests += element.adults;
            if (element.package.packageType === 'Half Board') {
                halfBoardCount += 1;
            } else if (element.package.packageType === 'Full Board') {
                fullBoardCount += 1;
            }
        }
        return { rooms: roomCount, halfBoard: halfBoardCount, fullBoard: fullBoardCount, guests: guests };
    }

    async getFinancialReport() {
        const finantialData = await database.getMonthlyBookingsData();
        var roomTotal = 0;
        var hallTotal = 0;
        for (let i = 0; i < finantialData.roomData.length; i++) {
            const element = finantialData.roomData[i];
            roomTotal += element.total;
        }
        for (let i = 0; i < finantialData.hallData.length; i++) {
            const element = finantialData.hallData[i];
            hallTotal += element.total;
        }
        return { roomIncome: roomTotal, hallIncome: hallTotal };
    }

    async getMonthlyRoomStatusReport() {

    }

    async getMonthlyHallStatusReport() {
        const data = await database.getMonthlyHallStatus();
        return data;
    }

}

module.exports = new ReceptionUtility();