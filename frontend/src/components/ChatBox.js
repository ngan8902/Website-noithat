import React, { useState, useRef, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { SOCKET_URI, USER_EVENTS } from "../constants/chat.constant";
import axios from "axios";

const Chatbox = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const socketIO = useRef(null);
  const [showLabel, setShowLabel] = useState(true);
  const [showChatButton, setShowChatButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowChatButton(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const labelTimer = setTimeout(() => setShowLabel(false), 3000);
    return () => clearTimeout(labelTimer);
  }, []);

  useEffect(() => {
    let storedUserId = null;
    if (isAuthenticated && user?._id) {
      storedUserId = user._id;
    }
    setUserId(storedUserId);
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (userId) {
        const conversationId1 = userId;
        let allMessages = [];

        try {
          const response1 = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/chat/${conversationId1}`);
          allMessages = [...response1.data];
        } catch (error) {
          console.error(`Lỗi khi lấy tin nhắn cho ${conversationId1}:`, error);
        }

        const sortedMessages = allMessages.sort((a, b) => a.timestamp - b.timestamp);
        let formattedMessages = sortedMessages.map((msg) => ({
          text: msg.message,
          sender: msg.fromRole === "User" || msg.fromRole === "Guest" ? "user" : "bot",
        }));

        if (formattedMessages.length === 0) {
          formattedMessages = [{ text: "Tôi có thể giúp gì cho bạn?", sender: "bot" }];
        }

        setMessages(formattedMessages);
      } else {
        setMessages([{ text: "Tôi có thể giúp gì cho bạn?", sender: "bot" }]);
      }
    };

    fetchMessages();
  }, [userId]);

  useEffect(() => {
    setTimeout(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, 0);
}, [messages]);


  useEffect(() => {
    if (userId) {
      socketIO.current = window?.io(SOCKET_URI);

      socketIO.current.on(USER_EVENTS.recieveMsg, (messageObj) => {
        const conversationId1 = `${userId}`;
        const conversationId2 = `${userId}`;

        if (messageObj.conversationId === conversationId1 || messageObj.conversationId === conversationId2) {
          setMessages((prev) => [...prev, { sender: "bot", text: messageObj.message }]);
        }
      });

      socketIO.current.on("connect_error", (err) => {
        console.error("Lỗi kết nối Socket.IO:", err);
      });

      socketIO.current.on("connect_timeout", (timeout) => {
        console.error("Kết nối Socket.IO hết thời gian chờ:", timeout);
      });

      return () => {
        if (socketIO.current) {
          socketIO.current.off(USER_EVENTS.recieveMsg);
          socketIO.current.off("connect_error");
          socketIO.current.off("connect_timeout");
        }
      };
    }
  }, [userId]);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (!isAuthenticated) return;

    if (!input.trim() || !userId ) return;

    const conversationId = userId;
    const messageObj = {
      from: userId,
      fromRole: "User",
      to: "system",
      toRole: "Staff",
      message: input,
      timestamp: new Date().getTime(),
      conversationId: conversationId,
    };

    setMessages([...messages, { sender: "user", text: input }]);
    socketIO.current.emit(USER_EVENTS.sendMsg, messageObj);
    setInput("");
  };

  return (
    <div className="chatbox-wrapper">
      {showChatButton && (
        <>
          {showLabel && <span className="chatbox-label">Chat với nhân viên!</span>}
          <button className="chatbox-button" onClick={toggleChatbox}>
            <i className="bi bi-chat"></i>
          </button>
        </>
      )}

      {isOpen && (
        <div className="chatbox-container">
          <div className="chatbox-header">
            <h4>{isAuthenticated ? `Chào ${user?.name}` : "Hỗ trợ khách hàng"}</h4>
            <button onClick={toggleChatbox}>
              <i className="bi bi-x-octagon-fill"></i>
            </button>
          </div>

          <div className="chatbox-body">
            {isAuthenticated ? (
              <>
                {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
                ))}
              </>
            ) : (
              <div className="message bot">
                Bạn cần đăng nhập để chat, chúng tôi sẽ hỗ trợ bạn tốt hơn.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbox-footer">
            {isAuthenticated ? (
              <>
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Gửi</button>
              </>
            ) : (
              null
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
