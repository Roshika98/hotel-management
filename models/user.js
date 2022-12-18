const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String },
    mobile: String,
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address'
    },
    name: String,
    googleId: String,
    profPicUrl: {
        type: String,
        default: 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-default-avatar-profile-icon-vector-social-media-user-image-vector-illustration-227787227.jpg'
    },
    facebookID: String,
    twitterID: String,
    isLoyaltyCustomer: {
        type: Boolean,
        default: false
    },
    stripeCustID: String,
    loyaltyPoints: { type: Number, default: 0 }
});


userSchema.plugin(passportLocalMongoose, { usernameField: 'email', usernameQueryFields: ['email'] });
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);