const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    line1: String,
    city: String,
    state: String,
    country: String,
    postal_code: String
});



module.exports = mongoose.model('Address', addressSchema);