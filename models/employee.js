const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    mobile: String,
    address: String,
    name: String,
    empType: {
        type: String,
        enum: ['receptionist', 'manager'],
        default: 'receptionist'
    }
});


employeeSchema.plugin(passportLocalMongoose);
employeeSchema.plugin(findOrCreate);

module.exports = mongoose.model('Employee', employeeSchema);