const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hallSchema = new Schema({
    hallNo: Number,
    hallType: {
        type: Schema.Types.ObjectId,
        ref: 'HallType'
    }
});



module.exports = mongoose.model('Hall', hallSchema);