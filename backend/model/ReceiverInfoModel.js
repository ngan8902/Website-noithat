const mongoose = require("mongoose");

const receiverSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
},
    {
        timestamps: true
    });
const ReceiverInfo = mongoose.model("ReceiverInfo", receiverSchema);
module.exports = ReceiverInfo;
