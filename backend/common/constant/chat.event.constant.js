const USER_EVENTS = {
    sendMsg: "user-send-msg",
    recieveMsg: "user-recieve-msg",
    messagesRead: "USER:MESSAGES_READ",
}

const STAFF_EVENTS = {
    sendMsg: "staff-send-msg",
    recieveMsg: "staff-recieve-msg",
    newMessage: "STAFF:NEW_MESSAGE",
    markAsRead: "STAFF:MARK_AS_READ",
}


module.exports = {
    USER_EVENTS,
    STAFF_EVENTS,
}