import React, { useState, useEffect, useRef, useCallback } from "react";
import { SOCKET_URI, STAFF_EVENTS } from "../../constants/chat.constant";
import useAuthStore from "../../store/authStore";
import useAuthAdminStore from "../../store/authAdminStore";
import axios from "axios";
import moment from "moment";

const avatarDefautl = "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg";

const ChatMessages = ({ customer }) => {
  const [messages, setMessages] = useState([]);
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
    console.log("Customer in ChatMessages:", customer);

    const fetchMessages = async () => {
      if (customer?.id && staff?._id) {
        const conversationId1 = `${customer.id}-${staff._id}`;
        const conversationId2 = `${staff._id}-${customer.id}`;
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
        setMessages(sortedMessages);
      } else {
        setMessages([]);
      }
    };

    fetchMessages();

    socketIO.current = window?.io(SOCKET_URI);

    socketIO.current.on(STAFF_EVENTS.recieveMsg, (messageObj) => {
      setMessages((prev) => {
        const updatedMessages = [...prev, { ...messageObj, timestamp: messageObj.timestamp || new Date().getTime() }];
        updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
        return updatedMessages;
      });
    });

    socketIO.current.on("connect_error", (err) => {
      console.error("Lỗi kết nối Socket.IO:", err);
    });

    return () => {
      if (socketIO.current) {
        socketIO.current.disconnect();
      }
    };
  }, [customer, staff]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !userId || !staff?._id || !socketIO.current || !customer?.id) return;

    let conversationId = `${customer?.id}-${staff?._id}`;

    const messageObj = {
      from: staff._id,
      fromRole: "Staff",
      to: customer.id,
      toRole: customer.toRole,
      message: newMessage,
      timestamp: new Date().getTime(),
      conversationId: conversationId,
    };

    console.log("Sent message:", messageObj);

    socketIO.current.emit(STAFF_EVENTS.sendMsg, messageObj);
    setMessages((prev) => {
      const updatedMessages = [...prev, { sender: "employee", message: newMessage, timestamp: messageObj.timestamp, fromRole: "Staff" }];
      updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
      return updatedMessages;
    });
    setNewMessage("");
  }, [messages, newMessage, userId, staff, customer]);

  if (!customer) {
    return (
      <div className="chat-messages d-flex flex-column align-items-center justify-content-center text-center p-4">
        <img src="/images/secret.png" alt="Chưa chọn khách hàng" width="150" className="mb-3" />
        <h5 className="text-muted">Vui lòng chọn một khách hàng để trò chuyện</h5>
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    return moment(timestamp).format("HH:mm DD/MM/YYYY");
  };

  return (
    <div className="chat-messages d-flex flex-column p-3">
      <div className="chat-header d-flex align-items-center pb-3 border-bottom">
        <img src={customer.avatar || avatarDefautl} alt={customer.name} className="rounded-circle me-3" width="45" height="45" />
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
        <input type="text" className="form-control flex-grow-1 me-2 rounded-pill" placeholder="Nhập tin nhắn..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
        <button className="btn btn-primary rounded-circle" onClick={sendMessage}>
          <i className="bi bi-send"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;