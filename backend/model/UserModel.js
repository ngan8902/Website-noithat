const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        email: { type: String, required: true},
        password: { type: String, required: true},
        isAdmin: { type: Boolean, default: false, required: true},
        phone: { type: String, required:true},
        avatar: {type: String},
        address:{type: String},
        access_token: { type: String},
        refresh_token: { type: String}
    },
    {
        timestamps: true, //Thời gian tạo và update
    }
);
const User = mongoose.model("User", userSchema);
module.exports = User;