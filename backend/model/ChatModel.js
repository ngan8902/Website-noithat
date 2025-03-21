const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, enum: ["User", "Staff", "Guest"], required: false },
  fromRole: { type: String, enum: ["User", "Staff", "Guest"], required: true },
  guestId: { type: String, required: false }, 
  to: { type: mongoose.Schema.Types.ObjectId, refPath: "toRole", required: false },
  toRole: { type: String, enum: ["User", "Staff", "Guest"], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", ChatSchema);
