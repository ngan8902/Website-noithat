import React, { useState, useEffect, useRef } from "react";

const ChatMessages = ({ customer }) => {
  const [chatHistory, setChatHistory] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (customer) {
      setMessages(chatHistory[customer.id] || [{ sender: "customer", text: customer.lastMessage }]);
    }
  }, [customer, chatHistory]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const updatedMessages = [...messages, { sender: "employee", text: newMessage }];
    setMessages(updatedMessages);
    setChatHistory((prev) => ({
      ...prev,
      [customer.id]: updatedMessages
    }));
    
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
        {messages.map((msg, index) => (
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
        />
        <button className="btn btn-primary rounded-circle" onClick={sendMessage}>
          <i className="bi bi-send"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;
