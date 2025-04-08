const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        content: {
            type: String,
            required: true,
        },
        mediaFile: [{
            type: String,
        }],
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;