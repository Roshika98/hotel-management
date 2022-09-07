const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    googleId: String,
    googleProfName: String,
    profPicUrl: String
});


userSchema.plugin(passportLocalMongoose, { usernameField: 'email', usernameQueryFields: ['email'] });
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);