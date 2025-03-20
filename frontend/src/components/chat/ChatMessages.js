import React, { useState, useEffect, useRef } from "react";
import { SOCKET_URI, STAFF_EVENTS } from "../../constants/chat.constant";

const ChatMessages = ({ customer }) => {
  const [msgInComing, setMsgInComing] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const messagesChat = useRef([]);

  const socketIO = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      socketIO.current = window?.io(SOCKET_URI);
      socketIO.current.on(STAFF_EVENTS.recieveMsg, (messageObj) => {
        setMsgInComing(true);
        setTimeout(() => {
          const { message } = messageObj;
          messagesChat.current = [...messagesChat.current, {
            sender: "customer", text: message
          }]
          setMsgInComing(false);
        }, 400)
      });
    }, 1000);
  }, []);


  useEffect(() => {
    if (messagesChat.current.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });//, [messagesChat.current]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    messagesChat.current = [...messagesChat.current, {
      sender: "employee", text: newMessage
    }]

    const messageObj = {
      from: "staff id",
      to: "user chanel id",
      message: newMessage,
      timestamp: new Date().getTime()
    }
    socketIO.current.emit(STAFF_EVENTS.sendMsg, messageObj);

    setNewMessage("");
  };

  if (!customer) {
    return (
      <div className="chat-messages d-flex flex-column align-items-center justify-content-center text-center p-4">
        <img
          src="/images/secret.png"
          alt="Chưa chọn khách hàng"
          width="150"
          className="mb-3"
        />
        <h5 className="text-muted">Vui lòng chọn một khách hàng để trò chuyện</h5>
      </div>
    );
  }

  return (
    <div className="chat-messages d-flex flex-column p-3">
      <div className="chat-header d-flex align-items-center pb-3 border-bottom">
        <img
          src={customer.avatar}
          alt={customer.name}
          className="rounded-circle me-3"
          width="45"
          height="45"
        />
        {customer.name}
      </div>

      <div className="messages flex-grow-1 overflow-auto p-2">
        {messagesChat.current.map((msg, index) => (
          <div key={`${customer.id}-${index}`} className={`message ${msg.sender}`}>
            <p className="mb-0">{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input d-flex align-items-center p-2 border-top">
        <input
          type="text"
          className="form-control flex-grow-1 me-2 rounded-pill"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        {msgInComing ? <span>Tin nhan dang den</span> : null}
        <button className="btn btn-primary rounded-circle" onClick={sendMessage}>
          <i className="bi bi-send"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;
