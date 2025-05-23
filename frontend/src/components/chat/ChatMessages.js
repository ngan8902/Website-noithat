import React, { useState, useEffect, useRef, useCallback } from "react";
import { SOCKET_URI, STAFF_EVENTS } from "../../constants/chat.constant";
import useAuthStore from "../../store/authStore";
import useAuthAdminStore from "../../store/authAdminStore";
import axios from "axios";
import moment from "moment";
import { UPLOAD_URL } from "../../constants/url.constant";

const ChatMessages = ({ customer }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const socketIO = useRef(null);
  const { user, isAuthenticated } = useAuthStore();
  const { staff } = useAuthAdminStore();
  const expireInMilliseconds = 24 * 60 * 60 * 1000;

  useEffect(() => {
    let storedUserId = localStorage.getItem("chatUserId");
    const expirationTime = localStorage.getItem("chatUserIdExpiration");

    if (isAuthenticated && user?._id) {
      storedUserId = user._id;
    } else if (storedUserId && expirationTime && Date.now() < parseInt(expirationTime)) {
      // Dùng lại ID cũ nếu chưa hết hạn
    } else {
      storedUserId = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem("chatUserId", storedUserId);
      localStorage.setItem("chatUserIdExpiration", (Date.now() + expireInMilliseconds).toString());
    }
    setUserId(storedUserId);
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!customer?.id || !staff?._id) {
        setMessages([]);
        return;
      }

      let conversationId = customer.id.startsWith("guest_")
        ? `${customer.id}-${staff._id}`
        : customer.id;

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL_BACKEND}/chat/${conversationId}`
        );
        const sortedMessages = response.data.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(sortedMessages);

        // ✅ Mark as read sau khi load
        await axios.post(`${process.env.REACT_APP_URL_BACKEND}/chat/mark-as-read`, {
          conversationId,
          to: staff._id,
        });
      } catch (error) {
        console.error("Lỗi khi lấy hoặc cập nhật trạng thái tin nhắn:", error);
        setMessages([]);
      }
    };

    fetchMessages();

    socketIO.current = window?.io(SOCKET_URI);

    socketIO.current.on(STAFF_EVENTS.recieveMsg, (messageObj) => {
      // ✅ Gộp và sắp xếp lại khi có tin nhắn đến
      setMessages((prev) => {
        const updatedMessages = [...prev, {
          ...messageObj,
          timestamp: messageObj.timestamp || Date.now()
        }];
        return updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
      });
    });

    return () => {
      socketIO.current?.disconnect();
    };
  }, [customer, staff]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !userId || !staff?._id || !socketIO.current || !customer?.id) return;

    const conversationId = customer.id.startsWith("guest_")
      ? `${customer.id}-${staff._id}`
      : customer.id;

    const guestId = localStorage.getItem("chatUserId");

    const messageObj = {
      from: staff._id,
      fromRole: "Staff",
      to: customer.id,
      toRole: customer.toRole,
      message: newMessage,
      timestamp: Date.now(),
      conversationId,
      guestId,
    };

    socketIO.current.emit(STAFF_EVENTS.sendMsg, messageObj);

    setMessages((prev) => {
      const updatedMessages = [...prev, {
        ...messageObj,
        sender: "employee",
      }];
      return updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
    });

    setNewMessage("");
  }, [newMessage, userId, staff, customer]);

  if (!customer) {
    return (
      <div className="chat-messages d-flex flex-column align-items-center justify-content-center text-center p-4">
        <img src="/images/secret.png" alt="Chưa chọn khách hàng" width="150" className="mb-3" />
        <h5 className="text-muted">Vui lòng chọn một khách hàng để trò chuyện</h5>
      </div>
    );
  }

  const formatTimestamp = (timestamp) => moment(timestamp).format("HH:mm DD/MM/YYYY");

  const getImageUrl = (avatar) => {
    if (!avatar) return "";

    if (avatar.includes("lh3.googleusercontent.com")) {
      return avatar;
    }

    if (avatar.includes("drive.google.com")) {
      const match = avatar.match(/id=([a-zA-Z0-9_-]+)/);
      const idFromViewLink = avatar.match(/\/d\/(.*?)\//);
      const id = match ? match[1] : idFromViewLink ? idFromViewLink[1] : null;

      if (id) {
        return `${process.env.REACT_APP_URL_BACKEND}/image/drive-image/${id}`;
      } else {
        console.error("Không thể lấy ID từ Google Drive link:", avatar);
      }
    }

    // Nếu là link https bình thường
    if (avatar.startsWith("https://")) {
      return avatar;
    }

    // Nếu là file local trên server
    return `${UPLOAD_URL}${avatar}`;
  };

  return (
    <div className="chat-messages d-flex flex-column p-3">
      <div className="chat-header d-flex align-items-center pb-3 border-bottom">
        <img src={getImageUrl(customer.avatar, "/images/guest.png")} alt={customer.name} className="rounded-circle me-3" width="45" height="45" />
        {customer.name}
      </div>
      <div className="messages flex-grow-1 overflow-auto p-2">
        {messages.map((msg, index, array) => {
          const showTimestamp = index === 0 || moment(msg.timestamp).diff(moment(array[index - 1].timestamp), "hours") >= 1;
          return (
            <div key={msg._id || index} className={`message ${msg.fromRole === "Staff" ? "employee" : "customer"}`}>
              <p className="mb-0">{msg.message}</p>
              {showTimestamp && <small className="text-muted">{formatTimestamp(msg.timestamp)}</small>}
            </div>
          );
        })}
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
