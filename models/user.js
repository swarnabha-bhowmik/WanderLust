const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
    },
    email:
    {
        type: String,
        required: true,
    }
});

const plm = passportLocalMongoose.default || passportLocalMongoose;
userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);