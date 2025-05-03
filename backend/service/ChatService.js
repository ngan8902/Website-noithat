const Chat = require("../model/ChatModel");

/**
 * Lấy trạng thái 'isRead' của các tin nhắn trong cuộc trò chuyện
 * @param {String} conversationId - ID của cuộc trò chuyện
 * @param {String} to - ID của người nhận tin nhắn
 * @returns {Object} Trạng thái isRead của tin nhắn
 */


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
        const { from, to, message, timestamp, conversationId, fromRole, toRole } = messageData;
        let chatMessage = null;

        chatMessage = new Chat({
            from: from,
            fromRole: fromRole,
            to: to,
            toRole: toRole,
            message: message,
            timestamp: timestamp,
            conversationId: conversationId,
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

const getIsReadStatus = async (conversationId, to) => {
    try {
        const messages = await Chat.find(
            { conversationId, to }
        ).sort({ timestamp: 1 }); // Sắp xếp tin nhắn theo thứ tự thời gian tăng dần

        if (messages.length === 0) {
            return { message: "Không tìm thấy tin nhắn trong cuộc trò chuyện" };
        }

        // Lấy trạng thái isRead của các tin nhắn
        const isReadStatus = messages.map((msg) => ({
            messageId: msg._id,
            isRead: msg.isRead,
        }));

        return isReadStatus;
    } catch (error) {
        throw new Error("Lỗi khi lấy trạng thái tin nhắn");
    }
};


module.exports = {
    getMessagesByReceiver,
    createMessage,
    markAsRead,
    getMessagesByConversationId,
    getIsReadStatus
}