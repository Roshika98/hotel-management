const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hallBookingSchema = new Schema({
    hall: {
        type: Schema.Types.ObjectId,
        ref: 'Hall'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    bookedDate: Date,
    reserveDate: Date,
    guestCount: Number,
    total: Number
});



module.exports = mongoose.model('HallBooking', hallBookingSchema);