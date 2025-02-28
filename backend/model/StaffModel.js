const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true},
        password: { type: String, required: true},
        name: { type: String, required: true},
        email: { type: String, required: true},
        phone: { type: Number, required:true},
        role_id: {type: Number, require: true},
        avatar: {type: String},
        position: {type: String, require: true},
        address:{type: String, require: true},
        dob: {type: String, require: true},
        gender: {type: String, require: true},
        access_token: { type: String},
        refresh_token: { type: String}
    },
    {
        timestamps: true, //Thời gian tạo và update
    }
);
const Staff = mongoose.model("Staff", userSchema);
module.exports = Staff;