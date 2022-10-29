const database = require('../database/database');

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


}

module.exports = new BookingUtility();