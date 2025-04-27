import { SOCKET_URI as SOCKET_URL } from './url.constant';

export const SOCKET_URI = `ws://${SOCKET_URL}`;

export const USER_EVENTS = {
    sendMsg: "user-send-msg",
    recieveMsg: "user-recieve-msg"
}

export const STAFF_EVENTS = {
 sendMsg: "staff-send-msg",
 recieveMsg: "staff-recieve-msg",
}