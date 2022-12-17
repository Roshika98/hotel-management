const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentTime = new Schema({
    sessionID: String,
    initTime: Date
});



module.exports = mongoose.model('PaymentTime', paymentTime);