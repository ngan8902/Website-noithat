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
        const { from, to, message, timestamp, conversationId, fromRole, toRole, isRead } = messageData;
        let chatMessage = null;

        chatMessage = new Chat({
            from: from,
            fromRole: fromRole,
            to: to,
            toRole: toRole,
            message: message,
            timestamp: timestamp,
            conversationId: conversationId,
            isRead: isRead
        });


        return chatMessage.save();
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

const hasUnreadMessages = async (id) => {
    const unreadMessages = await Chat.find({
      to: id,
      toRole: "Staff",
      isRead: false,
    })
    return unreadMessages.length > 0;
  };

module.exports = {
    getMessagesByReceiver,
    createMessage,
    markAsRead,
    getMessagesByConversationId,
    hasUnreadMessages
}