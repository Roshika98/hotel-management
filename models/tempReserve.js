const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempReserveSchema = new Schema({
    sessionID: String,
    checkIn: Date,
    checkOut: Date,
    deluxe: Number,
    superior: Number,
    family: Number,
    package: Number,
    adults: Number,
    children: Number
});


module.exports = mongoose.model('TempReserve', tempReserveSchema);