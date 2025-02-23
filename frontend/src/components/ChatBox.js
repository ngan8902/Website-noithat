import React, { useState, useRef, useEffect } from "react";
import useAuthStore from "../store/authStore";

const Chatbox = () => {
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      setMessages([{ text: "Xin chào! Tôi có thể giúp gì cho bạn?", sender: "bot" }]);
    } else {
      setMessages([{ text: "Bạn cần đăng nhập để gửi tin nhắn!", sender: "bot" }]);
    }
  }, [isAuthenticated]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (!isAuthenticated) {
      setMessages([...messages, { text: "Bạn cần đăng nhập để gửi tin nhắn!", sender: "bot" }]);
      return;
    }

    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    // Trả lời tự động sau 1s (mô phỏng chatbot đơn giản)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Cảm ơn bạn! Tôi sẽ phản hồi sớm nhất." }
      ]);
    }, 1000);
  };

  return (
    <>
      <button className="chatbox-button" onClick={toggleChatbox}>
        <i className="bi bi-chat"></i> Chat
      </button>

      {isOpen && (
        <div className="chatbox-container">
          <div className="chatbox-header">
            <h4>Hỗ trợ khách hàng</h4>
            <button onClick={toggleChatbox}><i className="bi bi-x-octagon-fill"></i></button>
          </div>

          <div className="chatbox-body">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbox-footer">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={!isAuthenticated}
            />
            <button onClick={sendMessage} disabled={!isAuthenticated}>Gửi</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbox;
