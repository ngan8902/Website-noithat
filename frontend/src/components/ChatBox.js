import React, { useState, useRef, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { SOCKET_URI, USER_EVENTS, STAFF_EVENTS } from "../constants/chat.constant";

const Chatbox = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Tôi có thể giúp gì cho bạn?", sender: "bot" }]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const socketIO = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => {
      socketIO.current = window?.io(SOCKET_URI);
      socketIO.current.on(USER_EVENTS.recieveMsg, (messageObj) => {
        console.log(`Ms:::`, messageObj);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: messageObj.message }
        ]);
      });
    }, 1000);
  }, []);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);


    const messageObj = {
      from: "user id",
      to: "chanel id",
      message: input,
      timestamp: new Date().getTime()
    }
    socketIO.current.emit(USER_EVENTS.sendMsg, messageObj);

    setInput("");
    // Trả lời tự động sau 1s (mô phỏng chatbot đơn giản)
    // setTimeout(() => {
    //   setMessages((prev) => [
    //     ...prev,
    //     { sender: "bot", text: "Cảm ơn bạn! Tôi sẽ phản hồi sớm nhất." }
    //   ]);
    // }, 1000);
  };

  return (
    <>
      <button className="chatbox-button" onClick={toggleChatbox}>
        <i className="bi bi-chat"></i> Chat
      </button>

      {isOpen && (
        <div className="chatbox-container">
          <div className="chatbox-header">
            <h4>
              {isAuthenticated ? `Chào ${user?.name}` : "Hỗ trợ khách hàng"}
            </h4>
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
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbox;
