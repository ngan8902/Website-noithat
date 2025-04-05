import React, { useState, useRef, useEffect } from "react";
import useAuthStore from "../store/authStore";
import useAuthAdminStore from "../store/authAdminStore";
import { SOCKET_URI, USER_EVENTS } from "../constants/chat.constant";
import axios from "axios";

const Chatbox = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { auth, staff } = useAuthAdminStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const socketIO = useRef(null);
  const staffFetched = useRef(false);
  const [showLabel, setShowLabel] = useState(true);

  useEffect(() => {
    // Ẩn dòng chữ sau 3 giây
    const labelTimer = setTimeout(() => setShowLabel(false), 3000);
    return () => clearTimeout(labelTimer);
  }, []);

  useEffect(() => {
    let storedUserId = localStorage.getItem("chatUserId");
    let storedGuestId = localStorage.getItem("guestId");

    if (isAuthenticated && user?._id) {
      storedUserId = user._id;
      localStorage.removeItem("chatUserId");
      localStorage.removeItem("chatUserIdExpiration");
      localStorage.removeItem("guestId");
    } else if (!storedUserId) {
      storedUserId = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem("chatUserId", storedUserId);

      if (!storedGuestId) {
        storedGuestId = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        localStorage.setItem("guestId", storedGuestId);
      }

      const expireInMilliseconds = 1.5 * 24 * 60 * 60 * 1000;
      localStorage.setItem("chatUserIdExpiration", (Date.now() + expireInMilliseconds).toString());

      setTimeout(() => {
        localStorage.removeItem("chatUserId");
        localStorage.removeItem("chatUserIdExpiration");
        localStorage.removeItem("guestId");
      }, expireInMilliseconds);
    }

    setUserId(storedUserId);
  }, [isAuthenticated, user]);

  const fetchStaffInfo = async () => {
    try {
      if (!staffFetched.current) {
        await auth();
        staffFetched.current = true;
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin nhân viên:", error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (userId && staff?._id) {
        const conversationId1 = `${userId}-${staff._id}`;
        const conversationId2 = `${staff._id}-${userId}`;
        let allMessages = [];

        try {
          const response1 = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/chat/${conversationId1}`);
          allMessages = [...response1.data];
        } catch (error) {
          console.error(`Lỗi khi lấy tin nhắn cho ${conversationId1}:`, error);
        }

        try {
          const response2 = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/chat/${conversationId2}`);
          allMessages = [...allMessages, ...response2.data];
        } catch (error) {
          console.error(`Lỗi khi lấy tin nhắn cho ${conversationId2}:`, error);
        }

        const sortedMessages = allMessages.sort((a, b) => a.timestamp - b.timestamp);
        let formattedMessages = sortedMessages.map(msg => ({ text: msg.message, sender: msg.fromRole === "User" || msg.fromRole === "Guest" ? "user" : "bot" }));

        if (formattedMessages.length === 0) {
          formattedMessages = [{ text: "Tôi có thể giúp gì cho bạn?", sender: "bot" }];
        }

        setMessages(formattedMessages);
      } else {
        setMessages([{ text: "Tôi có thể giúp gì cho bạn?", sender: "bot" }]);
      }
    };

    fetchMessages();
  }, [userId, staff]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (userId && staff?._id) {
      socketIO.current = window?.io(SOCKET_URI);

      socketIO.current.on(USER_EVENTS.recieveMsg, (messageObj) => {
        const conversationId1 = `${userId}-${staff?._id}`;
        const conversationId2 = `${staff?._id}-${userId}`;

        if (messageObj.conversationId === conversationId1 || messageObj.conversationId === conversationId2) {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: messageObj.message }
          ]);
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
  }, [userId, staff]);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
    if (!isOpen) fetchStaffInfo();
  };

  const sendMessage = () => {
    if (!input.trim() || !userId || !staff?._id || !socketIO.current) return;

    let storedGuestId = localStorage.getItem("guestId");
    let isGuest = userId.startsWith("guest_");
    let conversationId = `${userId}-${staff._id}`;
    // Tạo lại guestId nếu cần
    if (isGuest && !storedGuestId) {
      storedGuestId = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem("guestId", storedGuestId);

      const expireInMilliseconds = 1.5 * 24 * 60 * 60 * 1000;
      localStorage.setItem("chatUserIdExpiration", (Date.now() + expireInMilliseconds).toString());

      setTimeout(() => {
        localStorage.removeItem("chatUserId");
        localStorage.removeItem("chatUserIdExpiration");
        localStorage.removeItem("guestId");
      }, expireInMilliseconds);
    }

    const messageObj = {
      from: isGuest ? null : userId,
      fromRole: isGuest ? "Guest" : "User",
      guestId: isGuest ? storedGuestId : null,
      to: staff._id,
      toRole: "Staff",
      message: input,
      timestamp: new Date().getTime(),
      conversationId: conversationId,
    };

    console.log(messageObj)


    setMessages([...messages, { sender: "user", text: input }]);
    socketIO.current.emit(USER_EVENTS.sendMsg, messageObj);
    setInput("");
  };

  return (
    <div className="chatbox-wrapper">
      {showLabel && <span className="chatbox-label">Chat với nhân viên!</span>}
      <button className="chatbox-button" onClick={toggleChatbox}>
        <i className="bi bi-chat"></i>
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
    </div>
  );
};

export default Chatbox;