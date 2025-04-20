const express = require('express');
const router = express.Router();
const ChatController = require('../controller/ChatController');

router.get('/:receiverId/:receiverRole', ChatController.getMessagesByReceiver);
router.post('/createMess', ChatController.createMessage);
router.get('/:conversationId', ChatController.getMessagesByConversationId);
router.post("/mark-as-read", ChatController.markAsRead);

module.exports = router;
