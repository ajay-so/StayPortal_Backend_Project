const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    gmail :{
        type : String,
        required : true,
    },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);

