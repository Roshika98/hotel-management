const database = require('../database/database');


class BookingUtility {

    constructor() {

    }

    async estimatePayment(params) {
        const { deluxe, superior, family, diffDays } = await this.#estimatePaymentUtil(params);
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

    async #estimatePaymentUtil(params) {
        const checkIn = new Date(params.checkIn);
        const checkOut = new Date(params.checkOut);
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round(Math.abs((checkIn - checkOut) / oneDay));
        const deluxe = await database.getDeluxeRoomDetails();
        const superior = await database.getSuperiorRoomDetails();
        const family = await database.getFamilyRoomDetails();
        return { deluxe, superior, family, diffDays };
    }

    async createBooking() {
        var bookingid;
        if (arguments.length === 3) {
            bookingid = await this.#createStandardUserBooking(arguments[0], arguments[1], arguments[2]);
        } else if (arguments.length === 4) {
            bookingid = await this.#createLoyaltyMemberBooking(arguments[0], arguments[1], arguments[2], arguments[3]);
        }
        return bookingid;
    }

    async getRemainingTimePayment(sessionID) {
        const startTime = await database.getTimerData(sessionID);
        console.log(startTime);
        const endTime = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60))));
        console.log(endTime);
        var remainingTime = endTime - startTime;
        remainingTime = Math.trunc(remainingTime / 1000);
        console.log(parseInt(process.env.PAYMENT_TIMEOUT) - remainingTime);
        return parseInt(process.env.PAYMENT_TIMEOUT) - remainingTime;
    }

    async confirmBooking(bookingID, paymentID) {
        const tempbooking = await database.getTemporaryBookingDetail(bookingID);
        const params = {
            roomCount: tempbooking.roomCount,
            roomNumbers: tempbooking.roomNumbers,
            user: tempbooking.user,
            checkIn: tempbooking.checkIn,
            checkOut: tempbooking.checkOut,
            advance: tempbooking.advance,
            total: tempbooking.total,
            adults: tempbooking.adults,
            children: tempbooking.children,
            package: tempbooking.package,
            bookedDate: tempbooking.bookedDate,
            advancePayID: paymentID
        };
        const confirmedBooking = await database.confirmRoomBooking(params);
        return confirmedBooking;
    }

    async discardBooking(id, sessionID) {
        const removeTempBooking = await database.deleteTempBooking(id);
        const removeSessionData = await database.deleteTempReserveData(sessionID);
        const removeTimer = await database.deletePaymentTimerData(sessionID);
        return removeTempBooking;
    }

    async #createStandardUserBooking(params, userData, id) {
        var { deluxeCount, superiorCount, familyCount, bookedRooms } = await this.#BookRooms(params);
        var newAddress = await this.#createAddress(userData.address);
        const newUser = await database.createStandardUser({
            email: userData.email,
            mobile: userData.phone,
            address: newAddress,
            name: userData.fname + ' ' + userData.lname,
        });
        return await this.#bookingUtil(params, deluxeCount, superiorCount, familyCount, bookedRooms, newUser, id);
    }

    async #createLoyaltyMemberBooking(params, newData, id, user) {
        var { deluxeCount, superiorCount, familyCount, bookedRooms } = await this.#BookRooms(params);
        if (user.address && user.mobile) {
            return await this.#bookingUtil(params, deluxeCount, superiorCount, familyCount, bookedRooms, user, id);
        } else {
            var newAddress = await this.#createAddress(newData.address);
            var newUser = await database.updateLoyaltyMember(user, newData, newAddress);
            return await this.#bookingUtil(params, deluxeCount, superiorCount, familyCount, bookedRooms, user, id);
        }
    }


    async #bookingUtil(params, deluxeCount, superiorCount, familyCount, bookedRooms, newUser, id) {
        var pckg = await this.#getPackageInfo(params);
        const payment = await this.estimatePayment(params);
        var newDate = new Date();
        var today = newDate.toISOString().split('T')[0];
        const newBooking = await this.#makeTemparoryReservation(deluxeCount, superiorCount, familyCount, bookedRooms, newUser, params, payment, pckg, today);
        const deleteData = await database.deleteTempReserveData(id);
        console.log(newBooking);
        return newBooking.id;
    }

    async #getPackageInfo(params) {
        var pckg = null;
        if (params.package == 0) {
            pckg = await database.getPackageDetails('room only');
        } else if (params.package == 1) {
            pckg = await database.getPackageDetails('Half Board');
        } else {
            pckg = await database.getPackageDetails('Full Board');
        }
        return pckg;
    }

    async #makeTemparoryReservation(deluxeCount, superiorCount, familyCount, bookedRooms, newUser, params, payment, pckg, today) {
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
        // console.log(bookedRooms);
        const newBooking = await database.createTempRoomReservation(bookingParams);
        return newBooking;
    }

    async #createAddress(address) {
        const obj = {
            line1: address.line1,
            city: address.city,
            state: address.state,
            country: address.country,
            postal_code: address.postalCode
        };
        const newAddress = await database.createNewAddress(obj);
        return newAddress;
    }


    async #BookRooms(params) {
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
        return { deluxeCount, superiorCount, familyCount, bookedRooms };
    }

    async updateCustomerStripeID(id, stripeID) {
        const updateResult = await database.updateCustomerStripeID(id, stripeID);
        return updateResult;
    }

}




module.exports = new BookingUtility();

