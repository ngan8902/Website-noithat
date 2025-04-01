const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'fromRole',
    required: function () {
      return !this.guestId;
    },
  },
  fromRole: {
    type: String,
    enum: ['User', 'Staff'],
    required: function () {
      return !this.guestId;
    },
  },
  guestId: {
    type: String,
    required: function () {
      return !this.from;
    },
  },
  to: {
    type: mongoose.Schema.Types.Mixed,
    refPath: 'toRole',
    required: true,
  },
  toRole: {
    type: String,
    enum: ['User', 'Staff'],
    required: false,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    conversationId: { type: String, required: true },
  });

module.exports = mongoose.model('Chat', ChatSchema);