const Chat = require("../model/ChatModel");
const Staff = require("../model/StaffModel");
const User = require("../model/UserModel");
const mongoose = require("mongoose");


const sendChat = async ({ from, fromRole, guestId, to, toRole, message }) => {
    try {
        const validRoles = ["User", "Staff", "Guest"];
        if (!validRoles.includes(fromRole) || !validRoles.includes(toRole)) {
            throw new Error("Vai trò không hợp lệ!");
        }

        if (fromRole !== "Guest" && !mongoose.Types.ObjectId.isValid(from)) {
            throw new Error("ID của người gửi không hợp lệ");
        }
        if (toRole !== "Guest" && !mongoose.Types.ObjectId.isValid(to)) {
            throw new Error("ID của người nhận không hợp lệ");
        }

        if (fromRole !== 'Guest' && from) {
            const senderExists = fromRole === 'User' ? await User.findById(from) : await Staff.findById(from);
            if (!senderExists) throw new Error("Người gửi không tồn tại!");
        }

        if (toRole !== 'Guest') {
            const recipientExists = toRole === 'User' ? await User.findById(to) : await Staff.findById(to);
            if (!recipientExists) throw new Error("Người nhận không tồn tại!");
        }

        const chatData = {
            from: fromRole === "Guest" ? null : from,
            fromRole,
            guestId: guestId || null,
            to: toRole === "Guest" ? null : to,
            toRole,
            message,
            timestamp: Date.now()
        };

        const chat = new Chat(chatData);
        return await chat.save();
    } catch (error) {
        throw new Error("Lỗi khi lưu tin nhắn: " + error.message);
    }
}


const getMessages = async (from, fromRole, guestId, to, toRole) => {
    try {

        if (!fromRole || !toRole) {
            throw new Error("Thiếu vai trò của người gửi hoặc người nhận!");
        }

        const isGuest = fromRole === "Guest";
        if (isGuest && !guestId) {
            throw new Error("Thiếu guestId khi người gửi là khách vãng lai!");
        }

        if (!isGuest) {
            if (!mongoose.Types.ObjectId.isValid(from) || !mongoose.Types.ObjectId.isValid(to)) {
                throw new Error("ID người gửi hoặc nhận không hợp lệ!");
            }

            const userExists = await User.findById(from);
            if (!userExists) {
                throw new Error("Người dùng không tồn tại!");
            }
        }

        const query = isGuest
            ? { $or: [{ guestId, to, toRole }, { guestId, from: to, fromRole: toRole }] }
            : { $or: [{ from, to, fromRole, toRole }, { from: to, to: from, fromRole: toRole, toRole: fromRole }] };

        const messages = await Chat.find(query).sort({ timestamp: 1 });

        return messages;
    } catch (e) {
        throw new Error("Lỗi khi lấy thông tin đoạn chat: " + e.message);
    }
};


module.exports = {
    sendChat,
    getMessages
}