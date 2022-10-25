const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomtypeSchema = new Schema({
    roomType: {
        type: String,
        enum: ['standard', 'deluxe', 'super deluxe'],
        default: 'standard'
    },
    maxGuests: Number,
    standardPrice: Number,
    halfBoardPrice: Number,
    fullBoardPrice: Number,
    description: String,
    facilities: [String]
});



module.exports = mongoose.model('RoomType', roomtypeSchema);