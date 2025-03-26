const mongoose = require("mongoose");
const Product = require("./ProductModel");

const orderSchema = new mongoose.Schema(
    {
        orderCode: { type: String, unique: true },
        orderItems: [
            {
                name: { type: String, required: true },
                amount: { type: [Number], required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                discount: { type: Number, required: false },
                countInStock: { type: Number, required: false },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
            },
        ],
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ReceiverInfo",
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "VnPay"],
            required: true
        },
        itemsPrice: { type: String, required: false },
        totalPrice: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        orderDate: { type: String },
        isDelivered: { type: Boolean, default: false },
        delivered: { type: String },
        shoppingFee: {type: Number, default: 0},
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled", "return", "received", "return_requested","cancelled_confirmed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
