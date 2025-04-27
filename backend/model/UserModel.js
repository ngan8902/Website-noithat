const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        email: { type: String, required: true},
        password: { type: String},
        phone: { type: String},
        avatar: {type: String},
        address:{type: String},
        access_token: { type: String},
        refresh_token: { type: String},
        googleId: { type: String, unique: true, sparse: true},
        resetPasswordOTP: { type: String },
        otpExpires: { type: Date },
    },
    {
        timestamps: true, //Thời gian tạo và update
    }
);
const User = mongoose.model("User", userSchema);
module.exports = User;