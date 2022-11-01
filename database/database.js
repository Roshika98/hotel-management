const Booking = require('../models/booking');
const Package = require('../models/package');
const RoomType = require('../models/roomType');
const Room = require('../models/room');
const User = require('../models/user');

class Database {
    constructor() {
        console.log('Db handler created!');
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


    async getBookingDetails() {

        // Define two overloaded functions
        var function1 = async function (id) {
            const booking = await Booking.findById(id).populate([{ path: 'roomNumbers', populate: 'roomType' }, { path: 'user' }, { path: 'package' }]);
            return booking;
        };

        var function2 = async function (email, custName) {
            const customer = await User.findOne({ email: email });
            // TODO update the search filter by adding current date so only checkins for today are searched
            const checkinDate = new Date();
            // checkinDate.setHours(0, 0, 0, 0);
            const dateString = checkinDate.toISOString().split('T')[0];
            const details = await Booking.findOne({ user: customer, checkIn: new Date(`${dateString}`), status: 'booked' }).populate(['roomNumbers', 'user', 'package']);
            // console.log(details.checkIn);
            // console.log(details);
            return details;
        };
        if (arguments.length === 2) {
            return function2(arguments[0], arguments[1]);
        } else if (arguments.length === 1
            && !Array.isArray(arguments[0])) {
            return function1(arguments[0]);
        }
    }

    // 
    async getCheckedInCustomers() {
        var dateVal = new Date();
        var checkOutDate = dateVal.toISOString().split('T')[0];
        const details = await Booking.find({ status: 'checkedIn', checkOut: new Date(`${checkOutDate}`) }).populate([{ path: 'roomNumbers', populate: 'roomType' }, { path: 'user' }, { path: 'package' }]);
        console.log(details);
        return details;
    }

    // async getCheckedInCustomer(id) {
    //     const details = await Booking.findById(id).populate([{ path: 'roomNumbers', populate: 'roomType' }, { path: 'user' }, { path: 'package' }]);
    //     return details;
    // }

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


    async reserveAvailableRooms(params) {
        const availableRooms = await this.getAvailableRooms(params.checkIn, params.checkOut);

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
}


module.exports = new Database();