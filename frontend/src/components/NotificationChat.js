import React, { useEffect, useState } from "react";
import axios from "axios";
import { SOCKET_URI, STAFF_EVENTS } from "../constants/chat.constant";
import { STAFF_TOKEN_KEY } from "../constants/authen.constant";
import { getCookie } from "../utils/cookie.util";

const NotificationChat = () => {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkUnread = async () => {
      const token = getCookie(STAFF_TOKEN_KEY);
      if (!token) {
        window.location.href = "admin/login";  
        return;
      }
      try {
        const res = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/chat/has-new-message`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          withCredentials: true,
        });
        setHasUnread(res.data.hasUnread); 
      } catch (err) {
        console.error("Lỗi lấy trạng thái tin nhắn:", err);
      }
    };

    checkUnread();
  }, []);

  useEffect(() => {
    const socket = window.io(SOCKET_URI);

    socket.on(STAFF_EVENTS.recieveMsg, () => {
      setHasUnread(true);  
    });

    return () => socket.off(STAFF_EVENTS.recieveMsg);  
  }, []);

  const handleClick = () => {
    setHasUnread(false); 
    window.location.href = "/admin/chat";  
  };

  if (!hasUnread) return null;

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        background: "#fff",
        border: "1px solid #ccc",
        padding: "10px 16px",
        borderRadius: 8,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        cursor: "pointer",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#1e88e5"
      }}
    >
      <span role="img" aria-label="bell" style={{ fontSize: "20px" }}>🔔</span>
      <strong>Có tin nhắn mới</strong>
    </div>
  );
};

export default NotificationChat;
