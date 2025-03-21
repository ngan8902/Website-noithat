const express = require('express');
const router = express.Router();
const ChatController = require('../controller/ChatController');


router.post('/send', ChatController.sendChat)
router.get('/messages', ChatController.getMessages)



module.exports = router;
