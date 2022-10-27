const Booking = require('../models/booking');
const Package = require('../models/package');
const RoomType = require('../models/roomType');
const Room = require('../models/room');

class Database {
    constructor() {
        console.log('Db handler created!');
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

    async getAvailableRooms(start, end) {
        const reserved = await Booking.find({
            $and: [
                {
                    checkIn: { $gte: new Date() }
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
        console.log(reserved);
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
                console.log(element.roomNumbers[0]);
            });
            const available = await Room.find({ _id: { $nin: reservedRoomIds } }).populate('roomType');
            console.log("Available room count: " + available.length);
            return available;
        }
    }
}


module.exports = new Database();