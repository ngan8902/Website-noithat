import React, { useState } from "react";
import ChatList from "../components/chat/ChatList";
import ChatMessages from "../components/chat/ChatMessages";
import Sidebar from "../components/sales/Sidebar";

const Chat = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <div className="d-flex app-container">
      <Sidebar />
      <div className="chat-container">
        <ChatList onSelectCustomer={setSelectedCustomer} />
        <ChatMessages customer={selectedCustomer} />
      </div>
    </div>
  );
};

export default Chat;
