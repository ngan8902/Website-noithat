import React, { useState, useEffect, useRef } from "react";
import { SOCKET_URI, STAFF_EVENTS } from "../../constants/chat.constant";
import useAuthStore from "../../store/authStore";
import useAuthAdminStore from "../../store/authAdminStore";

const ChatMessages = ({ customer }) => {
  const [messages, setMessages] = useState([]); // Lưu danh sách tin nhắn
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);

  const messagesEndRef = useRef(null);
  const socketIO = useRef(null);

  const { user, isAuthenticated } = useAuthStore();
  const { staff } = useAuthAdminStore();

  useEffect(() => {
    let storedUserId = localStorage.getItem("chatUserId");

    if (isAuthenticated && user?._id) {
      storedUserId = user._id;
    } else if (!storedUserId) {
      storedUserId = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem("chatUserId", storedUserId);
    }

    setUserId(storedUserId);
  }, [isAuthenticated, user]);

  useEffect(() => {
    socketIO.current = window?.io(SOCKET_URI);

    socketIO.current.on(STAFF_EVENTS.recieveMsg, (messageObj) => {
      setMessages((prev) => [...prev, { sender: "customer", text: messageObj.message }]);
    });

    return () => {
      socketIO.current.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !userId || !staff?._id || !socketIO.current) return;

    const isGuest = userId.startsWith("guest_");
    const toId = user?._id || localStorage.getItem("guestId");

    const messageObj = {
      from: staff._id,
      fromRole: "Staff",
      to: toId,
      toRole: isGuest ? "Guest" : "User",
      message: newMessage,
      timestamp: new Date().getTime(),
    };

    socketIO.current.emit(STAFF_EVENTS.sendMsg, messageObj);
    setMessages([...messages, { sender: "employee", text: newMessage }]);
    setNewMessage("");
  };

  if (!customer) {
    return (
      <div className="chat-messages d-flex flex-column align-items-center justify-content-center text-center p-4">
        <img src="/images/secret.png" alt="Chưa chọn khách hàng" width="150" className="mb-3" />
        <h5 className="text-muted">Vui lòng chọn một khách hàng để trò chuyện</h5>
      </div>
    );
  }

  return (
    <div className="chat-messages d-flex flex-column p-3">
      <div className="chat-header d-flex align-items-center pb-3 border-bottom">
        <img src={customer.avatar} alt={customer.name} className="rounded-circle me-3" width="45" height="45" />
        {customer.name}
      </div>

      <div className="messages flex-grow-1 overflow-auto p-2">
        {messages.map((msg, index) => (
          <div key={customer.id} className={`message ${msg.sender}`}>
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
        <button className="btn btn-primary rounded-circle" onClick={sendMessage}>
          <i className="bi bi-send"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;
