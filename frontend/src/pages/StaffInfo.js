import React, { useState } from "react";
import Sidebar from "../components/sales/Sidebar";
import ManagerInfo from "../components/sales/ManagerInfo";

const StaffInfo = () => {
  const manager = {
    avatar: "/images/banner.png",
    id: 1,
    name: "Tạ Duy Công Chiến",
    dob: "10/10/1985",
    email: "manager@example.com",
    phone: "0123456789",
  };

  return (
    <div className="d-flex app-container">
      <Sidebar />
      <div className="content p-4 main-content">
        <ManagerInfo manager={manager} />
      </div>
    </div>
  );
};

export default StaffInfo;
