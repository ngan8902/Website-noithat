const express = require('express');
const router = express.Router();
const ChatController = require('../controller/ChatController');
const { authenticateStaff } = require('../middleware/authMiddleware')


router.get('/:receiverId/:receiverRole', ChatController.getMessagesByReceiver);
router.post('/createMess', ChatController.createMessage);
router.get('/:conversationId', ChatController.getMessagesByConversationId);
router.post("/mark-as-read", ChatController.markAsRead);
router.get("/has-new-message", authenticateStaff, ChatController.getUnreadStatus);


module.exports = router;
