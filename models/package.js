const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    packageType: {
        type: String,
        enum: ['room only', 'bread & breakfast', 'Half Board', 'Full Board'],
        default: 'room only'
    },
    description: String,
    itemsIncluded: [String]
});



module.exports = mongoose.model('Package', packageSchema);