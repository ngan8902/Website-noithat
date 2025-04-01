const { Server } = require("socket.io");
const { STAFF_EVENTS, USER_EVENTS } = require("../common/constant/chat.event.constant");
const ChatService = require("../service/ChatService");
const mongoose = require("mongoose");

function initializeChatSocket(server) {
    const io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
        socket.on(USER_EVENTS.sendMsg, async (messageObj) => {
            try {
                let { from, to, message, timestamp, guestId, conversationId } = messageObj;

                ({ from, to } = validateAndFixIds(from, to));
                if (!guestId) {
                    guestId = messageObj.localGuestId;
                }

                if ((!from && !guestId) || !to || !message) {
                    console.error("Dữ liệu tin nhắn không hợp lệ:", messageObj);
                    return;
                }

                timestamp = validateTimestamp(timestamp);
                messageObj.timestamp = timestamp;

                if (!conversationId) {
                    conversationId = guestId ? `guest-${guestId}-${to}` : `${from}-${to}`;
                }

                await ChatService.createMessage({
                    from: from,
                    fromRole: "User",
                    to: to,
                    toRole: "Staff",
                    message: message,
                    timestamp: timestamp,
                    conversationId: conversationId,
                    guestId: guestId,
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
                let { from, to, message, timestamp, guestId, conversationId } = messageObj;
                ({ from, to } = validateAndFixIds(from, to));

                if (!from || (!to && !to.startsWith("guest_")) || !message) {
                    console.error("Dữ liệu tin nhắn từ nhân viên không hợp lệ:", messageObj);
                    return;
                }

                timestamp = validateTimestamp(timestamp);
                messageObj.timestamp = timestamp;

                if (!conversationId) {
                    conversationId = guestId ? `${guestId}-${to}` : `${from}-${to}`;
                }

                if (guestId) {
                    await ChatService.createMessage({
                        from: from,
                        fromRole: "Staff",
                        to: to,
                        toRole: "Guest",
                        message: message,
                        timestamp: timestamp,
                        guestId: guestId,
                        conversationId: conversationId,
                    });
                } else {
                    await ChatService.createMessage({
                        from: from,
                        fromRole: "Staff",
                        to: to,
                        toRole: "User",
                        message: message,
                        timestamp: timestamp,
                        conversationId: conversationId,
                    });
                }

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

function validateAndFixIds(from, to) {
    if (typeof from === "object" && from !== null && from.from) from = from.from;
    if (typeof to === "object" && to !== null && to.to) to = to.to;

    if (mongoose.Types.ObjectId.isValid(from)) from = new mongoose.Types.ObjectId(from);
    else from = null;

    if (typeof to === "string" && to.startsWith("guest_")) {
    } else if (mongoose.Types.ObjectId.isValid(to)) {
        to = new mongoose.Types.ObjectId(to);
    } else {
        console.log("to không phải là ObjectId hợp lệ:", to);
        to = null;
    }

    return { from, to };
}

function validateTimestamp(timestamp) {
    return !timestamp || isNaN(timestamp) ? Date.now() : timestamp;
}

module.exports = {
    initializeChatSocket,
};