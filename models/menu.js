const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    menuType: {
        type: String,
        enum: ['Wedding Menu', 'Event Menu'],
        default: 'Event Menu'
    },
    description: String
});



module.exports = mongoose.model('Menu', menuSchema);