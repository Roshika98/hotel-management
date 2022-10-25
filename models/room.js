const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomNo: {
        type: Number,
    },
    roomType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomType'
    }
});


module.exports = mongoose.model('Room', roomSchema);