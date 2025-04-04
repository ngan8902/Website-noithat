import React, { useState, useEffect, useRef } from "react";
import useChatStore from "../../store/chatStore";
import axios from "axios";
import useAuthAdminStore from "../../store/authAdminStore";
import { SOCKET_URI, STAFF_EVENTS } from "../../constants/chat.constant";

const avatarDefautl = "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg";

const ChatList = ({ onSelectCustomer }) => {
  const { setCustomers } = useChatStore();
  const [customers, setCustomersList] = useState([]);
  const { staff } = useAuthAdminStore();
  const lastMessageRef = useRef({});
  const socketIO = useRef(null);

  const [hasNewMessage, setHasNewMessage] = useState(() => {
    const storedHasNewMessage = localStorage.getItem("hasNewMessage");
    return storedHasNewMessage ? JSON.parse(storedHasNewMessage) : {};
  });

  useEffect(() => {
    localStorage.setItem("hasNewMessage", JSON.stringify(hasNewMessage));
  }, [hasNewMessage]);

  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/user/get-all`);
        const users = response.data.data;

        let allCustomers = await Promise.all(
          users.map(async (user) => {
            const conversationId1 = `${user._id}-${staff?._id}`;
            const conversationId2 = `${staff?._id}-${user._id}`;
            let allMessages = [];

            try {
              const messagesResponse1 = await axios.get(
                `${process.env.REACT_APP_URL_BACKEND}/chat/${conversationId1}`
              );
              allMessages = [...messagesResponse1.data];
            } catch (error) {
              console.error(`Lỗi khi lấy tin nhắn cho ${user.name} với ${conversationId1}:`, error);
            }

            try {
              const messagesResponse2 = await axios.get(
                `${process.env.REACT_APP_URL_BACKEND}/chat/${conversationId2}`
              );
              allMessages = [...allMessages, ...messagesResponse2.data];
            } catch (error) {
              console.error(`Lỗi khi lấy tin nhắn cho ${user.name} với ${conversationId2}:`, error);
            }

            const sortedMessages = allMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const lastMessage = sortedMessages?.[0]?.message || "";
            const toRole = sortedMessages?.[0]?.toRole || null;
            const isRead =
              sortedMessages?.[0]?.fromRole === "Staff" ||
              sortedMessages?.[0]?.isRead;

            return {
              id: user._id,
              name: user.name,
              avatar: user.avatar,
              lastMessage: lastMessage,
              toRole,
              isRead,
              conversationId: conversationId1,
            };
          })
        );

        let guestId = localStorage.getItem("chatUserId");
        const expirationTime = localStorage.getItem("chatUserIdExpiration");

        if (guestId && expirationTime && Date.now() < parseInt(expirationTime)) {
          const guestConversationId = `${guestId}-${staff?._id}`;
          let guestMessages = [];

          try {
            const guestMessagesResponse = await axios.get(
              `${process.env.REACT_APP_URL_BACKEND}/chat/${guestConversationId}`
            );
            guestMessages = [...guestMessagesResponse.data];
          } catch (error) {
            console.error(
              `Lỗi khi lấy tin nhắn cho khách ${guestId} với ${guestConversationId}:`,
              error
            );
          }

          const sortedGuestMessages = guestMessages.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          const lastGuestMessage = sortedGuestMessages?.[0]?.message || "";
          const isGuestRead =
            sortedGuestMessages?.[0]?.fromRole === "Staff"
              ? true
              : sortedGuestMessages?.[0]?.isRead;

          let guestCounter = 1;
          const guestName = `Khách hàng ${guestCounter++}`;

          allCustomers = [
            ...allCustomers,
            {
              id: guestId,
              name: guestName,
              avatar: avatarDefautl,
              lastMessage: lastGuestMessage,
              isRead: isGuestRead,
              conversationId: guestConversationId,
            },
          ];
        }

        setCustomersList(allCustomers);
        setCustomers(allCustomers);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khách hàng:", error);
      }
    };
    fetchCustomersData();

    socketIO.current = window?.io(SOCKET_URI);

    socketIO.current.on(STAFF_EVENTS.recieveMsg, (messageObj) => {
      setCustomersList((prevCustomers) => {
        return prevCustomers.map((c) => {
          if (c.id === messageObj.guestId || c.id === messageObj.from) {
            return { ...c, lastMessage: messageObj.message, isRead: false };
          }
          return c;
        });
      });
      setHasNewMessage((prevStatus) => ({
        ...prevStatus,
        [messageObj.guestId || messageObj.from]: true,
      }));
    });

    return () => {
      socketIO.current.off(STAFF_EVENTS.recieveMsg);
    };
  }, [setCustomers, staff]);

  const handleSelectCustomer = async (customer) => {
    setHasNewMessage((prevStatus) => ({
      ...prevStatus,
      [customer.id]: false,
    }));
    lastMessageRef.current[customer.id] = "";
    onSelectCustomer(customer);

    try {
      if (!customer.id.startsWith("guest_")) {
        await axios.post(`${process.env.REACT_APP_URL_BACKEND}/chat/mark-as-read`, {
          conversationId: customer.conversationId,
          to: staff?._id,
        });
      }
      setCustomersList((prevCustomers) =>
        prevCustomers.map((c) =>
          c.id === customer.id ? { ...c, isRead: true } : c
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đã đọc:", error);
    }
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
                  src={customer.avatar || avatarDefautl}
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