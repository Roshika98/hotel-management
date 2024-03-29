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
    discount: { type: Number, default: 0 },
    total: Number,
    adults: Number,
    children: Number,
    package: {
        type: Schema.Types.ObjectId,
        ref: 'Package'
    },
    status: {
        type: String,
        enum: ['booked', 'checkedIn', 'checkedOut', 'cancelled'],
        default: 'booked'
    },
    bookedDate: Date,
    advancePayID: String
});



module.exports = mongoose.model('Booking', bookingSchema);