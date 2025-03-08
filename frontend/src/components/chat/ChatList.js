import React, { useEffect } from "react";
import useChatStore from "../../store/chatStore";

const customersData = [
  { id: 1, name: "Khánh Thành", avatar: "/images/logo.png", lastMessage: "Xin chào, chủ shop đẹp trai", unreadCount: 1 },
  { id: 2, name: "Bích Ngân", avatar: "/images/logo.png", lastMessage: "Sản phẩm này còn hàng không anh?", unreadCount: 1 },
  { id: 3, name: "A B C", avatar: "/images/logo.png", lastMessage: "Chào!", unreadCount: 1 }
];

const ChatList = ({ onSelectCustomer }) => {
  const { setCustomers } = useChatStore();

  useEffect(() => {
    setCustomers(customersData);
  }, [setCustomers]);

  return (
    <div className="chat-list p-3">
      <h5 className="fw-bold mb-4">Khách Hàng</h5>
      <ul className="list-unstyled">
        {customersData.map((customer) => (
          <li key={customer.id} className="mb-3">
            <button
              className="chat-item text-dark text-decoration-none w-100 border-0 bg-transparent position-relative"
              onClick={() => onSelectCustomer(customer)}
            >
              <div className="d-flex align-items-center p-3 rounded">
                <img className="rounded-circle border border-secondary shadow-sm" height="50" src={customer.avatar} width="50" alt={customer.name} />
                <div className="ms-3 flex-grow-1">
                  <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: "180px" }}>{customer.name}</h6>
                  <p className="mb-0 text-muted small text-truncate" style={{ maxWidth: "200px" }}>{customer.lastMessage}</p>
                </div>
                {customer.unreadCount > 0 && (
                  <span className="badge bg-danger position-absolute top-50 end-0 translate-middle">
                    {customer.unreadCount > 9 ? "9+" : customer.unreadCount}
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
