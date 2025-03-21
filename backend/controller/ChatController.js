const ChatService = require('../service/ChatService');
const mongoose = require("mongoose");


const sendChat = async (req, res) => {
    try {
        const { from, fromRole, guestId, to, toRole, message } = req.body;

        if (!to || !toRole || !message) {
            return res.status(401).json({
                status: 'ERR',
                message: 'Thiếu thông tin bắt buộc (người nhận, vai trò hoặc tin nhắn).'
            });
        }

        const chat = await ChatService.sendChat({ from, fromRole, guestId, to, toRole, message });

        return res.status(200).json({
            status: 'OK',
            message: 'Gửi tin nhắn thành công!',
            data: chat
        });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ message: error.message });
    }
}

const getMessages = async (req, res) => {
    try {
        console.log("Query nhận được:", req.query); 


        const { from, fromRole, to, toRole, guestId } = req.query;

        if (!from || !to) {
            return res.status(400).json({ message: "Thiếu thông tin người gửi hoặc người nhận!" });
        }

        if (!fromRole || !toRole) {
            return res.status(400).json({ message: "Thiếu vai trò của người gửi hoặc người nhận!" });
        }

        const messages = await ChatService.getMessages(from, fromRole, guestId, to, toRole);
        return res.status(200).json({ message: "Lấy tin nhắn thành công!", data: messages });
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}

module.exports = {
    sendChat,
    getMessages
}