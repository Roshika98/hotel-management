const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    roomCount: Number,
    roomNumbers: [{
        type: Schema.Types.ObjectId,
        ref: 'Room'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    checkIn: Date,
    checkOut: Date,
    advance: Number,
    total: Number,
    adults: Number,
    children: Number,
    package: {
        type: Schema.Types.ObjectId,
        ref: 'Package'
    }
});



module.exports = mongoose.model('Booking', bookingSchema);