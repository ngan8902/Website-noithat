import React, { useState } from "react";
import ChatList from "../components/chat/ChatList";
import ChatMessages from "../components/chat/ChatMessages";
import Sidebar from "../components/sales/Sidebar";

const Chat = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`d-flex app-container ${collapsed && window.innerWidth < 768 ? "sidebar-open" : ""}`}>
      {collapsed && window.innerWidth < 768 && (
        <div className="sidebar-overlay" onClick={() => setCollapsed(false)}></div>
      )}
      <Sidebar />
      <div className="main-content chat-container">
        <ChatList onSelectCustomer={setSelectedCustomer} />
        <ChatMessages customer={selectedCustomer} />
      </div>
    </div>
  );
};

export default Chat;
