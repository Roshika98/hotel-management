const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    roomType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomType'
    },
    roomCount: Number,
    roomNumbers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Room'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    checkIn: Date,
    checkOut: Date,
    advance: Number,
    total: Number,
    adults: Number,
    children: Number,
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
    }
});



module.exports = mongoose.model('Booking', bookingSchema);