import React, { useState, useEffect, useRef } from "react";
import useChatStore from "../../store/chatStore";
import axios from "axios";
import useAuthAdminStore from "../../store/authAdminStore";
import { SOCKET_URI, STAFF_EVENTS } from "../../constants/chat.constant";
import { UPLOAD_URL } from "../../constants/url.constant";

const avatarDefault = `${UPLOAD_URL}/upload/guest.png`;

const ChatList = ({ onSelectCustomer }) => {
  const { setCustomers } = useChatStore();
  const [customers, setCustomersList] = useState([]);
  const { staff } = useAuthAdminStore();
  const lastMessageRef = useRef({});
  const socketIO = useRef(null);

  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/user/get-all`);
        const users = response.data.data;

        const allCustomers = await Promise.all(
          users.map(async (user) => {
            const conversationId = `${user._id}`;
            let allMessages = [];

            try {
              const messagesResponse = await axios.get(
                `${process.env.REACT_APP_URL_BACKEND}/chat/${conversationId}`
              );
              allMessages = messagesResponse.data;
            } catch (error) {
              console.error(`Lỗi khi lấy tin nhắn cho ${user.name}:`, error);
            }

            const sortedMessages = allMessages.sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            );

            const lastMessageObj = sortedMessages?.[0];
            const lastMessage = lastMessageObj?.message || "";
            const toRole = lastMessageObj?.toRole || null;

            const isRead =
              !lastMessageObj ||
              lastMessageObj.fromRole === "Staff" ||
              lastMessageObj.isRead === true;

            return {
              id: user._id,
              name: user.name,
              avatar: user.avatar,
              lastMessage,
              toRole,
              isRead,
              conversationId,
            };
          })
        );

        setCustomersList(allCustomers);
        setCustomers(allCustomers);  // Cập nhật store
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khách hàng:", error);
      }
    };

    fetchCustomersData();

    socketIO.current = window?.io(SOCKET_URI);

    socketIO.current.on(STAFF_EVENTS.recieveMsg, (messageObj) => {
      setCustomersList((prevCustomers) =>
        prevCustomers.map((c) =>
          c.id === messageObj.from
            ? { ...c, lastMessage: messageObj.message, isRead: false }
            : c
        )
      );
      // Cập nhật lại store
      setCustomers((prevCustomers) =>
        prevCustomers.map((c) =>
          c.id === messageObj.from
            ? { ...c, lastMessage: messageObj.message, isRead: false }
            : c
        )
      );
    });

    return () => {
      socketIO.current.off(STAFF_EVENTS.recieveMsg);
    };
  }, [setCustomers, staff]);

  const handleSelectCustomer = async (customer) => {
    lastMessageRef.current[customer.id] = "";
    onSelectCustomer(customer);

    try {
      await axios.post(`${process.env.REACT_APP_URL_BACKEND}/chat/mark-as-read`, {
        conversationId: customer.conversationId,
        to: staff?._id,
      });

      // Cập nhật trạng thái 'isRead' trong component và store
      setCustomersList((prevCustomers) =>
        prevCustomers.map((c) =>
          c.id === customer.id ? { ...c, isRead: true } : c
        )
      );

      setCustomers((prevCustomers) =>
        prevCustomers.map((c) =>
          c.id === customer.id ? { ...c, isRead: true } : c
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đã đọc:", error);
    }
  };

  const getImageUrl = (avatar) => {
    if (avatar?.startsWith("http://")) return avatar;
    if (avatar) return `${UPLOAD_URL}${avatar}`;
    return avatarDefault;
  };

  return (
    <div className="chat-list p-3">
      <h5 className="fw-bold mb-4">Khách Hàng</h5>
      <ul className="list-unstyled">
        {customers.map((customer) => (
          <li key={customer.id} className="mb-3">
            <button
              className="chat-item text-dark text-decoration-none w-100 border-0 bg-transparent position-relative"
              onClick={() => handleSelectCustomer(customer)}
            >
              <div className="d-flex align-items-center p-3 rounded">
                <img
                  className="rounded-circle border border-secondary shadow-sm"
                  height="50"
                  src={getImageUrl(customer.avatar)}
                  width="50"
                  alt={customer.name}
                />
                <div className="ms-3 flex-grow-1">
                  <h6
                    className="fw-bold mb-1 text-truncate"
                    style={{ maxWidth: "180px" }}
                  >
                    {customer.name}
                  </h6>
                  <p
                    className="mb-0 text-muted small text-truncate"
                    style={{ maxWidth: "200px" }}
                  >
                    {customer.lastMessage}
                  </p>
                </div>
                {customer.isRead === false && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    <span className="custom-red-dot"></span>
                  </span>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
