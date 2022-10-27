const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomtypeSchema = new Schema({
    roomType: {
        type: String,
        enum: ['deluxe double room', 'superior double room', 'deluxe family room'],
        default: 'deluxe double room'
    },
    maxGuests: Number,
    standardPrice: Number,
    halfBoardPrice: Number,
    fullBoardPrice: Number,
    description: String,
    facilities: [String]
});



module.exports = mongoose.model('RoomType', roomtypeSchema);