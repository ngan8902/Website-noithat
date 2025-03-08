const { Server } = require('socket.io');
const { STAFF_EVENTS, USER_EVENTS } = require('../common/constant/chat.event.constant');

function initalizeChatSocket(server) {
    const io = new Server(server, { cors: { origin: '*' } });
    io.on('connection', (socket) => {
        console.log('a user connected');

        // Nghe su kien chat tu phia Client
        socket.on(USER_EVENTS.sendMsg, (messageObj) => {
            const { from, to, message, timestamp } = messageObj;
            socket.broadcast.emit(STAFF_EVENTS.recieveMsg, messageObj)
            // // luu du lieu
            // const { messageId, text, userId, from, to, timestamp } = message
            // MessageModel.updateMessage({
            //     messageId: messageId,
            //     messageObj: {
            //         userId, text, timestamp, from, to
            //     }
            // })
        })

        socket.on(STAFF_EVENTS.sendMsg, (messageObj) => {
            console.log("HHH", messageObj)
            const { from, to, message, timestamp } = messageObj;
            socket.broadcast.emit(USER_EVENTS.recieveMsg, messageObj)
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

}

module.exports = {
    initalizeChatSocket
}