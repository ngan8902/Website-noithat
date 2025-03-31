const Chat = require("../model/ChatModel");


const getMessagesByReceiver = async (receiverId, receiverRole) => {
    try {
        const messages = await Chat.find({
            to: receiverId,
            toRole: receiverRole,
        }).sort({ timestamp: 1 });
        console.log("Tin nhắn từ cơ sở dữ liệu:", messages);
        return messages;
    } catch (error) {
        throw error;
    }
};

// Tạo tin nhắn mới
const createMessage = async (messageData) => {
    try {
        const newMessage = new Chat(messageData);
        const savedMessage = await newMessage.save();
        return savedMessage;
    } catch (error) {
        throw error;
    }
};

const getMessagesByConversationId = async (conversationId) => {
    try {
        const messages = await Chat.find({ conversationId }).sort({ timestamp: 1 });
        return messages;
    } catch (error) {
        throw error;
    }
};

const markAsRead = async (conversationId, to) => {
    try {
        await Chat.updateMany(
            { conversationId, to, isRead: false },
            { isRead: true }
        );
        return { message: "Đã đánh dấu là đã đọc" };
    } catch (error) {
        throw error;
    }
};


module.exports = {
    getMessagesByReceiver,
    createMessage,
    markAsRead,
    getMessagesByConversationId
}