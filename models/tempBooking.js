const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempbookingSchema = new Schema({
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
    },
    status: {
        type: String,
        enum: ['booked', 'checkedIn', 'checkedOut', 'cancelled'],
        default: 'booked'
    },
    bookedDate: Date
});



module.exports = mongoose.model('TempBooking', tempbookingSchema);