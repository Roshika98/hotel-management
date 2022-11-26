const Booking = require('../models/booking');
const Package = require('../models/package');
const RoomType = require('../models/roomType');
const Room = require('../models/room');
const User = require('../models/user');
const Hall = require('../models/hall');
const HallBooking = require('../models/hallBooking');
const HallType = require('../models/hallType');
const TempReserve = require('../models/tempReserve');
const mongoose = require('mongoose');
const Address = require('../models/address');
// const hallBooking = require('../models/hallBooking');

class Database {
    constructor() {
        console.log('Db handler created!');
    }

    async getUserInfo(id) {
        const user = await User.findById(id);
        return user;
    }

    async getDeluxeRoomDetails() {
        const info = await RoomType.findOne({ roomType: 'deluxe double room' });
        return info;
    }

    async getSuperiorRoomDetails() {
        const info = await RoomType.findOne({ roomType: 'superior double room' });
        return info;
    }

    async getFamilyRoomDetails() {
        const info = await RoomType.findOne({ roomType: 'deluxe family room' });
        return info;
    }

    async getDeluxeRooms() {
        const type = await RoomType.findOne({ roomType: 'deluxe double room' });
        const rooms = await Room.find({ roomType: type }).populate('roomType');
        return rooms;
    }

    async getSuperiorRooms() {
        const type = await RoomType.findOne({ roomType: 'superior double room' });
        const rooms = await Room.find({ roomType: type }).populate('roomType');
        return rooms;
    }

    async getFamilyRooms() {
        const type = await RoomType.findOne({ roomType: 'deluxe family room' });
        const rooms = await Room.find({ roomType: type }).populate('roomType');
        return rooms;
    }

    async getAllRooms() {
        const rooms = await Room.find().populate('roomType');
        return rooms;
    }

    async getPackageDetails(pckg) {
        const details = await Package.findOne({ packageType: `${pckg}` });
        return details;
    }

    async getTempReserveData(id) {
        const data = await TempReserve.findOne({ sessionID: `${id}` });
        return data;
    }


    async getBookingsDueToday() {
        var newDate = new Date();
        var today = newDate.toISOString().split('T')[0];
        const bookings = await Booking.find({ checkIn: new Date(today), status: 'booked' }).populate(['user']);
        return bookings;
    }

    async getCheckedOutBookings() {
        const bookings = await Booking.find({ status: 'checkedOut' }).populate(['user']).sort({ 'checkOut': -1 }).limit(10);
        return bookings;
    }

    async getCheckedInBookings() {
        const bookings = await Booking.find({ status: 'checkedIn' }).populate(['user']).sort({ 'checkIn': 1 }).limit(10);
        return bookings;
    }

    async getFutureBookings() {
        var newDate = new Date();
        newDate.setDate(newDate.getDate() + 1);
        var tomorrow = newDate.toISOString().split('T')[0];
        const bookings = await Booking.find({ status: 'booked', checkIn: { $gte: new Date(tomorrow) } }).populate(['user']).sort({ 'checkIn': 1 }).limit(10);
        return bookings;
    }

    async getCancelledBookings() {
        const bookings = await Booking.find({ status: 'cancelled' }).populate(['user']).sort({ 'checkIn': 1 }).limit(10);
        return bookings;
    }




    async getBookingToCancel(email) {
        const user = await User.findOne({ email: email });
        const booking = await Booking.findOne({ user: user, status: 'booked' }).populate(['roomNumbers', 'user', 'package']);
        return booking;
    }


    async getBookingDetails() {

        // Define two overloaded functions
        var function1 = async function (id) {
            const booking = await Booking.findById(id).populate([{ path: 'roomNumbers', populate: 'roomType' }, { path: 'user', populate: 'address' }, { path: 'package' }]);
            return booking;
        };

        var function2 = async function (email, custName) {
            const customer = await User.findOne({ email: email });
            // TODO update the search filter by adding current date so only checkins for today are searched
            const checkinDate = new Date();
            const dateString = checkinDate.toISOString().split('T')[0];
            const details = await Booking.findOne({ user: customer._id, checkIn: new Date(`${dateString}`), status: 'booked' }).populate(['roomNumbers', 'user', 'package']);
            return details;
        };
        if (arguments.length === 2) {
            return function2(arguments[0], arguments[1]);
        } else if (arguments.length === 1
            && !Array.isArray(arguments[0])) {
            return function1(arguments[0]);
        }
    }


    async getCheckedInCustomers() {
        var dateVal = new Date();
        var checkOutDate = dateVal.toISOString().split('T')[0];
        const details = await Booking.find({ status: 'checkedIn', checkOut: new Date(`${checkOutDate}`) }).populate([{ path: 'roomNumbers', populate: 'roomType' }, { path: 'user' }, { path: 'package' }]);
        console.log(details);
        return details;
    }



    async getCheckedInCustomer() {
        var function1 = async function (id) {
            const details = await Booking.findById(id).populate([{ path: 'roomNumbers', populate: 'roomType' }, { path: 'user' }, { path: 'package' }]);
            return details;
        };

        var function2 = async function (email, custName) {
            const customer = await User.findOne({ email: email });
            // TODO update the search filter by adding current date so only checkins for today are searched
            const details = await Booking.findOne({ user: customer, status: 'checkedIn' }).populate(['roomNumbers', 'user', 'package']);
            console.log(details);
            return details;
        };
        if (arguments.length === 2) {
            return function2(arguments[0], arguments[1]);
        } else if (arguments.length === 1
            && !Array.isArray(arguments[0])) {
            return function1(arguments[0]);
        }
    }


    async getAllReservationsForToday() {

    }

    async getAvailableRooms(start, end) {
        const reserved = await Booking.find({
            $and: [
                {
                    $or: [{
                        checkIn: { $gte: new Date() }
                    }, {
                        checkOut: { $gte: new Date() }
                    }]
                }, {
                    $or: [
                        {
                            $or: [{
                                checkIn: { $gt: start, $lt: end }
                            }, {
                                checkOut: { $gt: start, $lt: end }
                            }]
                        }, {
                            $or: [{
                                checkIn: start
                            }, {
                                checkOut: end
                            }]
                        }, {
                            $and: [{
                                checkIn: { $lt: start }
                            }, {
                                checkOut: { $gt: end }
                            }]
                        }
                    ]
                }
            ]
        });
        if (reserved.length == 0) return await this.getAllRooms();
        else {
            var reservedRoomIds = [];
            reserved.forEach(element => {
                const array = element.roomNumbers;
                for (let i = 0; i < array.length; i++) {
                    if (!reservedRoomIds.includes(array[i])) {
                        reservedRoomIds.push(array[i]);
                    }
                }
            });
            const available = await Room.find({ _id: { $nin: reservedRoomIds } }).populate('roomType');
            console.log("Available room count: " + available.length);
            return available;
        }
    }

    async checkRoomAvailabilityToExtend(rooms, start, end) {
        const reserved = await Booking.find({
            $and: [{
                roomNumbers: { $in: rooms }
            }, {
                status: 'booked'
            }, {
                checkIn: { $gte: start, $lte: end }
            }]
        });
        return reserved;
    }

    async reserveAvailableRooms(params) {
        const availableRooms = await this.getAvailableRooms(params.checkIn, params.checkOut);

    }


    //# -----------------------HALL FUNCTIONS---------------------------------------------

    async checkHallAvailability(type, reserveDate) {
        console.log(type + ' ' + reserveDate);
        console.log('print type');
        const hType = await HallType.findOne({ hallType: type });
        console.log(hType);
        const h = await Hall.findOne({ hallType: hType });
        console.log(h);
        const reserved = await HallBooking.find({ hall: h._id, reserveDate: reserveDate });
        console.log(reserved);
        if (reserved.length > 0) { return false }
        else return true;
    }


    async getHall(type) {
        const hType = await HallType.findOne({ hallType: type });
        const h = await Hall.findOne({ hallType: hType }).populate('hallType');
        return h;
    }



    // *----------------- CREATE OPERATIONS----------------------

    async createStandardUser(data) {
        const newUser = await User.create(data);
        console.log(newUser);
        return newUser;
    }

    async createRoomReservation(data) {
        const newBooking = await Booking.create(data);
        // console.log(newBooking);
        return newBooking;
    }

    async createTempReserveData(id, data) {
        const params = {
            sessionID: id,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            deluxe: data.deluxe,
            superior: data.superior,
            family: data.family,
            package: data.package,
            adults: data.adults,
            children: data.children
        }
        const tempReserve = await TempReserve.create(params);
        return tempReserve;
    }

    async createHallBooking(params) {
        const newHallBooking = await HallBooking.create(params);
        return newHallBooking;
    }

    async createNewAddress(params) {
        const newAddress = await Address.create(params);
        return newAddress;
    }

    // *-----------------UPDATE OPERATIONS-------------------------

    async updateCheckInStatus(id) {
        const booking = await Booking.findByIdAndUpdate(id, { status: 'checkedIn' });
        console.log(booking);
        return booking;
    }

    async performCheckout(id) {
        const booking = await Booking.findByIdAndUpdate(id, { status: 'checkedOut' });
        return booking;
    }


    async cancelBooking(id) {
        const booking = await Booking.findByIdAndUpdate(id, { status: 'cancelled' });
        return booking;
    }

    async extendBooking(id, dateString, total) {
        const booking = await Booking.findByIdAndUpdate(id, { checkOut: dateString, total: total });
        return booking;
    }

    async confirmAdvancePayment(bookingID, paymentID) {
        const booking = await Booking.findByIdAndUpdate(bookingID, { advancePayID: paymentID });
        return booking;
    }


    // *------------------------DELETE OPERATIONS--------------------------------

    async deleteTempReserveData(id) {
        const tempData = await TempReserve.findOneAndDelete({ sessionID: `${id}` });
        return tempData;
    }


    // !---------------------REPORT DATA-----------------------------------------

    async dailyReservationsData() {
        var newDate = new Date();
        var today = newDate.toISOString().split('T')[0];
        const dailyBookings = await Booking.find({ status: 'booked', bookedDate: today }).populate(['package']);
        console.log(dailyBookings);
        return dailyBookings;
    }

    async getMonthlyBookingsData() {
        var newDate = new Date();
        var month = newDate.getMonth();
        var year = newDate.getFullYear();
        const monthlyRoomData = await Booking.aggregate([
            {
                $project:
                {
                    total: "$total",
                    year: { $year: "$checkOut" },
                    month: { $month: "$checkOut" }
                }
            },
            { $match: { "month": parseInt(month) + 1, "year": year } }
        ]);
        const monthlyHallData = await HallBooking.aggregate([
            {
                $project:
                {
                    total: "$total",
                    year: { $year: "$reserveDate" },
                    month: { $month: "$reserveDate" }
                }
            },
            { $match: { "month": parseInt(month) + 1, "year": year } }
        ])
        return { roomData: monthlyRoomData, hallData: monthlyHallData };
    }

    async getMonthlyRoomStatus() {

    }

    async getMonthlyHallStatus() {
        const masterHall = await Hall.findOne({ hallNo: 1 });
        const grownHall = await Hall.findOne({ hallNo: 2 });
        var newDate = new Date();
        var month = newDate.getMonth();
        var year = newDate.getFullYear();
        const masterhallDetails = await HallBooking.aggregate([
            {
                $project:
                {
                    hall: "$hall",
                    total: "$total",
                    year: { $year: "$reserveDate" },
                    month: { $month: "$reserveDate" }
                }
            },
            { $match: { "month": parseInt(month) + 1, "year": year, hall: mongoose.Types.ObjectId(masterHall.id) } }
        ]);
        const grownHallDetails = await HallBooking.aggregate([
            {
                $project:
                {
                    hall: "$hall",
                    total: "$total",
                    year: { $year: "$reserveDate" },
                    month: { $month: "$reserveDate" }
                }
            },
            { $match: { "month": parseInt(month) + 1, "year": year, hall: mongoose.Types.ObjectId(grownHall.id) } }
        ]);
        console.log({ master: masterhallDetails.length, grown: grownHallDetails.length });
        return { master: masterhallDetails.length, grown: grownHallDetails.length };
    }

}


module.exports = new Database();