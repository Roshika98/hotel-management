const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hallTypeSchema = new Schema({
    hallType: {
        type: String,
        enum: ['Master Banquet Hall', 'Grown Banquet Hall'],
        default: 'Grown Banquet Hall'
    },
    maxGuests: Number,
    rate: Number,
    description: String,
});



module.exports = mongoose.model('HallType', hallTypeSchema);