const Chat = require("../model/ChatModel")

const createChat = (newChat) => {
    return new Promise(async (resolve, reject) => {
        const { from, isGuest, to, message } = newChat
        try {
            const createdChat = await Chat.create({
                from, isGuest, to, message
            })
            if (createdChat) {
                resolve({
                    status: 'SUCCESS',
                    message: 'create chat success',
                    data: createdChat
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getChatByUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const getChat = await Chat.find({
                $or: [{ from: userId }, { to: userId }]
            }).sort({ timestamp: -1 })
            resolve({
                status: 'OK',
                message: 'success',
                data: getChat
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createChat,
    getChatByUser
}