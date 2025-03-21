import React, { useState, useRef, useEffect } from "react";
import useAuthStore from "../store/authStore";
import useAuthAdminStore from "../store/authAdminStore";
import { SOCKET_URI, USER_EVENTS } from "../constants/chat.constant";

const Chatbox = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { auth, staff } = useAuthAdminStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Tôi có thể giúp gì cho bạn?", sender: "bot" }]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const socketIO = useRef(null);

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

  const fetchStaffInfo = async () => {
    try {
      if (!staff) {
        await auth();
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin nhân viên:", error);
    }
  };


  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => {
      socketIO.current = window?.io(SOCKET_URI);
      socketIO.current.on(USER_EVENTS.recieveMsg, (messageObj) => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: messageObj.message }
        ]);
      });
    }, 1000);
  }, []);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
    if (!isOpen) fetchStaffInfo();
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    if (!userId) {
      console.error("Không thể gửi tin nhắn: userId không tồn tại!");
      return;
    }
    if (!staff || !staff?._id) {
      console.error("Không thể gửi tin nhắn: staff ID không hợp lệ!");
      return;
    }
    if (!socketIO.current) {
      console.error("Socket chưa khởi tạo!");
      return;
    }

    const isGuest = userId.startsWith("guest_");


    const messageObj = {
      from: isGuest ? null : userId,
      fromRole: isGuest ? "Guest" : "User",
      guestId: isGuest ? localStorage.getItem("guestId") : null,
      to: staff?._id,
      toRole: "Staff",
      message: input,
      timestamp: new Date().getTime()
    }

    setMessages([...messages, { sender: "user", text: input }]);
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
