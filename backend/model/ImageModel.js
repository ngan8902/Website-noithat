const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    filename: String,
    path: String,
    uploadedAt: { type: Date, default: Date.now },
});

const Images = mongoose.model("Images", imageSchema);
module.exports = Images;