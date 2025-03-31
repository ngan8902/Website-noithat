const ChatService = require('../service/ChatService');


// Lấy tin nhắn theo người nhận
const getMessagesByReceiver = async (req, res) => {
    try {
        const { receiverId, receiverRole } = req.params;
        console.log("Receiver ID:", receiverId, "Receiver Role:", receiverRole);

        const messages = await ChatService.getMessagesByReceiver(receiverId, receiverRole);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tạo tin nhắn
const createMessage = async (req, res) => {
    try {
        const messageData = req.body;
        const newMessage = await ChatService.createMessage(messageData);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getMessagesByConversationId = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await ChatService.getMessagesByConversationId(conversationId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { conversationId, to } = req.body;
        const result = await ChatService.markAsRead(conversationId, to);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMessagesByReceiver,
    createMessage,
    markAsRead,
    getMessagesByConversationId
}