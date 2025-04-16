const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        role_id: { type: Number, require: true, default: 2 },
        avatar: { type: String },
        address: { type: String, require: true },
        dob: { type: String, require: true },
        gender: { type: String },
        staffcode: { type: String, unique: true },
        access_token: { type: String },
        refresh_token: { type: String },
        faceEmbedding: {
            type: [Number],
            default: [],
        },
        faceRegistered: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);
const Staff = mongoose.model("Staff", userSchema);
module.exports = Staff;