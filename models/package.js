const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    packageType: {
        type: String,
        enum: ['standard', 'Half Board', 'Full Board'],
        default: 'standard'
    },
    description: String,
    itemsIncluded: [String]
});



module.exports = mongoose.model('Package', packageSchema);