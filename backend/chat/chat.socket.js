const { Server } = require("socket.io");
const { STAFF_EVENTS, USER_EVENTS } = require("../common/constant/chat.event.constant");
const ChatService = require("../service/ChatService");
const mongoose = require("mongoose");
const { validateTimestamp } = require('../common/utils/date');

function initializeChatSocket(server) {
    const io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
        socket.on(USER_EVENTS.sendMsg, async (messageObj) => {
            try {
                let { from, to, message, timestamp, conversationId } = messageObj;

                if(!conversationId && !message) throw new Error('Lỗi thiếu kênh và đoạn tin nhắn');

                timestamp = validateTimestamp(timestamp);
                messageObj.timestamp = timestamp;

                await ChatService.createMessage({
                    from: from,
                    fromRole: "User",
                    to: to,
                    toRole: "Staff",
                    message: message,
                    timestamp: timestamp,
                    conversationId: conversationId,
                });

                socket.broadcast.emit(STAFF_EVENTS.recieveMsg, messageObj);
                socket.broadcast.emit(STAFF_EVENTS.newMessage, {
                    conversationId: conversationId,
                    from: from,
                });
            } catch (error) {
                console.error("Lỗi khi lưu tin nhắn:", error);
            }
        });

        socket.on(STAFF_EVENTS.sendMsg, async (messageObj) => {
            try {
                let { from, to, message, timestamp, conversationId } = messageObj;
                
                if(!conversationId && !message) throw new Error('Lỗi thiếu kênh và đoạn tin nhắn');

                timestamp = validateTimestamp(timestamp);
                messageObj.timestamp = timestamp;

                await ChatService.createMessage({
                    from: from,
                    fromRole: "Staff",
                    to: to,
                    toRole: "User",
                    message: message,
                    timestamp: timestamp,
                    conversationId: conversationId,
                });

                socket.broadcast.emit(USER_EVENTS.recieveMsg, messageObj);
            } catch (error) {
                console.error("Lỗi khi xử lý tin nhắn nhân viên:", error);
            }
        });

        socket.on(STAFF_EVENTS.markAsRead, async (readObj) => {
            try {
                const { conversationId, staffId } = readObj;
                await ChatService.markAsRead(conversationId, staffId);

                socket.broadcast.emit(USER_EVENTS.messagesRead, { conversationId: conversationId });
            } catch (error) {
                console.error("Lỗi khi đánh dấu tin nhắn đã đọc:", error);
            }
        });

        socket.on("connect_error", (err) => {
            console.error("Lỗi kết nối Socket.IO:", err);
        });

        socket.on("connect_timeout", (timeout) => {
            console.error("Kết nối Socket.IO hết thời gian chờ:", timeout);
        });
    });
}
module.exports = {
    initializeChatSocket,
};