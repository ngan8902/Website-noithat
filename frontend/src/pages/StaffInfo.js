import React, { useState } from "react";
import Sidebar from "../components/sales/Sidebar";
import ManagerInfo from "../components/sales/ManagerInfo";
import useAuthAdminStore from "../store/authAdminStore";

const StaffInfo = () => {
  const { staff } = useAuthAdminStore((state) => state);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`d-flex app-container ${collapsed && window.innerWidth < 768 ? "sidebar-open" : ""}`}>
      {collapsed && window.innerWidth < 768 && (
        <div className="sidebar-overlay" onClick={() => setCollapsed(false)}></div>
      )}
      <Sidebar />
      <div className="main-content">
        <h2 className="text-center fw-bold mb-4">Thông Tin Nhân Viên</h2>
        <ManagerInfo staff={staff} />
      </div>
    </div>
  );
};

export default StaffInfo;
