const express = require('express');
const router = express.Router();
const ChatController = require('../controller/ChatController');


router.post('/create-chat' , ChatController.createChat)
router.get('/get-chat-by-user/:id' , ChatController.getChatByUser)



module.exports = router;
