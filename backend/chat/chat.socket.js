const { Server } = require('socket.io');
const { STAFF_EVENTS, USER_EVENTS } = require('../common/constant/chat.event.constant');
const ChatService = require('../service/ChatService');
const mongoose = require("mongoose");

function initalizeChatSocket(server) {
    const io = new Server(server, { cors: { origin: '*' } });
    io.on('connection', (socket) => {
        // Nghe su kien chat tu phia Client
        socket.on(USER_EVENTS.sendMsg, async (messageObj) => {
            try {
                let { from, guestId, to, message, timestamp } = messageObj;
                ({ from, to } = validateAndFixIds(from, to));

                if (!to || !message) {
                    console.error("Dữ liệu tin nhắn không hợp lệ:", messageObj);
                    return;
                }

                timestamp = validateTimestamp(timestamp);
                messageObj.timestamp = timestamp;


                socket.broadcast.emit(STAFF_EVENTS.recieveMsg, messageObj)
                await ChatService.sendChat(messageObj);

            } catch (error) {
                console.error("Lỗi khi lưu tin nhắn:", error);
            }
        })

        //Nghe su kien chat tu phia Admibn
        socket.on(STAFF_EVENTS.sendMsg, async (messageObj) => {
            try {
                let { from, to, message, timestamp } = messageObj;
                ({ from, to } = validateAndFixIds(from, to));

                if (!from || !message) {
                    console.error("Dữ liệu tin nhắn từ nhân viên không hợp lệ:", messageObj);
                    return;
                }

                timestamp = validateTimestamp(timestamp);
                messageObj.timestamp = timestamp;


                socket.broadcast.emit(USER_EVENTS.recieveMsg, messageObj)
                await ChatService.sendChat(messageObj);
            } catch (error) {
                console.error("Lỗi khi xử lý tin nhắn nhân viên:", error);
            }
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

}

//Hàm chuẩn hóa ID để tránh lỗi
function validateAndFixIds(from, to) {
    if (typeof from === "object" && from !== null && from.from) from = from.from;
    if (typeof to === "object" && to !== null && to.to) to = to.to;

    if (mongoose.Types.ObjectId.isValid(from)) from = new mongoose.Types.ObjectId(from);
    else from = null;

    if (mongoose.Types.ObjectId.isValid(to)) to = new mongoose.Types.ObjectId(to);
    else to = null;

    return { from, to };
}

//Hàm kiểm tra timestamp hợp lệ
function validateTimestamp(timestamp) {
    return (!timestamp || isNaN(timestamp)) ? Date.now() : timestamp;
}

module.exports = {
    initalizeChatSocket
}