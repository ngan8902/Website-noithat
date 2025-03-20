const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.Mixed, // Có thể là ObjectId hoặc thông tin khách vãng lai
        required: true
      },
      isGuest: {
        type: Boolean,
        default: false // Xác định người gửi có tài khoản hay không
      },
      to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: true
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
  });

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
