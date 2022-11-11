const database = require('../database/database');
const User = require('../models/user');
const Booking = require('../models/booking');

class BookingUtility {

    constructor() {

    }

    async estimatePayment(params) {
        const checkIn = new Date(params.checkIn);
        const checkOut = new Date(params.checkOut);
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round(Math.abs((checkIn - checkOut) / oneDay));
        const deluxe = await database.getDeluxeRoomDetails();
        const superior = await database.getSuperiorRoomDetails();
        const family = await database.getFamilyRoomDetails();
        var estimatedPrice = 0;
        var deluxeCount = parseInt(params.deluxe);
        var superiorCount = parseInt(params.superior);
        var familyCount = parseInt(params.family);
        if (params.package == 0)
            estimatedPrice = ((deluxeCount * deluxe.standardPrice) + (superiorCount * superior.standardPrice) + (familyCount * family.standardPrice)) * diffDays;
        else if (params.package == 1)
            estimatedPrice = ((deluxeCount * deluxe.halfBoardPrice) + (superiorCount * superior.halfBoardPrice) + (familyCount * family.halfBoardPrice)) * diffDays;
        else
            estimatedPrice = ((deluxeCount * deluxe.fullBoardPrice) + (superiorCount * superior.fullBoardPrice) + (familyCount * family.fullBoardPrice)) * diffDays;
        return { total: estimatedPrice, advance: Math.ceil((estimatedPrice * 20) / 100) };
    };

    async createBooking(params, userData, id) {
        const availableRooms = await database.getAvailableRooms(params.checkIn, params.checkOut);
        var deluxeCount = parseInt(params.deluxe);
        var superiorCount = parseInt(params.superior);
        var familyCount = parseInt(params.family);
        var currDeluxe = 0;
        var currSuperior = 0;
        var currFamily = 0;
        var bookedRooms = [];
        for (let i = 0; i < availableRooms.length; i++) {
            const element = availableRooms[i];
            if (element.roomType.roomType == 'deluxe double room' && currDeluxe < deluxeCount) {
                currDeluxe++;
                bookedRooms.push(element._id);
            } else if (element.roomType.roomType == 'superior double room' && currSuperior < superiorCount) {
                currSuperior++;
                bookedRooms.push(element._id);
            } else if (element.roomType.roomType == 'deluxe family room' && currFamily < familyCount) {
                currFamily++;
                bookedRooms.push(element._id);
            }
        }
        const newUser = await database.createStandardUser({
            email: userData.email,
            mobile: userData.phone,
            address: userData.address,
            name: userData.fname + ' ' + userData.lname,
        });
        var pckg = null;
        if (params.package == 0) {
            pckg = await database.getPackageDetails('room only');
        } else if (params.package == 1) {
            pckg = await database.getPackageDetails('Half Board');
        } else {
            pckg = await database.getPackageDetails('Full Board');
        }
        const payment = await this.estimatePayment(params);
        var newDate = new Date();
        var today = newDate.toISOString().split('T')[0];
        const bookingParams = {
            roomCount: deluxeCount + superiorCount + familyCount,
            roomNumbers: bookedRooms,
            user: newUser,
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            advance: payment.advance,
            total: payment.total,
            adults: params.adults,
            children: params.children,
            package: pckg,
            bookedDate: today
        };
        console.log(bookedRooms);
        const newBooking = await database.createRoomReservation(bookingParams);
        const deleteData = await database.deleteTempReserveData(id);
        console.log(newBooking);
        return newBooking.id;

    }
}




module.exports = new BookingUtility();