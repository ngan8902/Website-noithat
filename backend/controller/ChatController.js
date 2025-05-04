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

        const savedMessage = await ChatService.createMessage(messageData);

        res.status(201).json({
            message: "Tin nhắn đã được lưu thành công",
            data: savedMessage,
        });
    } catch (error) {
        console.error("Lỗi khi lưu tin nhắn:", error);
        res.status(500).json({
            message: "Lỗi khi lưu tin nhắn",
            error: error.message,
        });
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

const getUnreadStatus = async (req, res) => {
    try {
        const { id } = req['payload'];
        console.log(id)
        const hasUnread = await ChatService.hasUnreadMessages(id);
        res.json({ hasUnread });
    } catch (error) {
        console.error("Lỗi khi kiểm tra tin nhắn chưa đọc:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


module.exports = {
    getMessagesByReceiver,
    createMessage,
    markAsRead,
    getMessagesByConversationId,
    getUnreadStatus
}