const mongoose = require('mongoose');

const TemporaryOrderSchema = new mongoose.Schema({
    orderCode: {
        type: Number,
        required: true,
        unique: true,
    },
    paymentLinkId: { 
        type: String, 
        required: true, 
    },
    data: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800 
    }
});

module.exports = mongoose.model('TemporaryOrder', TemporaryOrderSchema);
