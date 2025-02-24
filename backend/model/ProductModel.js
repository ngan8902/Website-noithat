const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        image: {type: String, required: true},
        type: {type: String, required: true},
        price: {type: Number, required: true},
        countInStock: {type: Number, required: true},
        rating: {type: Number, required: true},
        description: {type: String},
        isBestSeller:{ type: Boolean, default: false, required: true},
        discount:{type: Number, default: 0, required: true},
        origin: {type: String},
        material: {type: String},
        size: {type: String},
        warranty: {type: String},
        productCode: { type: String, unique: true }
    },
    {
        timestamps: true
    }
);
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
