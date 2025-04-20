const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        image: {type: String, required: true},
        //images: { type: [String], default: [] },
        type: {type: String, required: true},
        price: {type: Number, required: true},
        countInStock: {type: Number, required: true},
        description: {type: String},
        descriptionDetail: {type: String},
        discount:{type: Number, default: 0},
        origin: {type: String},
        material: {type: String},
        size: {type: String},
        warranty: {type: String},
        isBestSeller: { type: Boolean},
        productCode: { type: String, unique: true },
        rating: {type: Number},
        feedback: { type: String},
    },
    {
        timestamps: true
    }
);
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
