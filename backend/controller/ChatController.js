const ChatService = require('../service/ChatService')

const createChat = async (req, res) => {
    try {
        const { from, isGuest = false, to, message } = req.body;
        if (!from || !to || !message) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Thiếu các trường'
            })
        }
        const response = await ChatService.createChat(req.body);
        return res.status(200).json(response);
    } catch (e) {
        res.status(500).json({
            message: e
        });
    }
}

const getChatByUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(401).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        const response = await ChatService.getChatByUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: e
        });
    }
}

module.exports = {
    createChat,
    getChatByUser
}