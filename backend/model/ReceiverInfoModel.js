const mongoose = require("mongoose");

const receiverSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false 
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: false 
    },
    fullname: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },

    isDefault: { type: Boolean, default: false }, 
}, 
{
    timestamps: true 
});

const ReceiverInfo = mongoose.model("ReceiverInfo", receiverSchema);
module.exports = ReceiverInfo;
