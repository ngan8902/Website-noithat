import React, { useState } from "react";
import Sidebar from "../components/sales/Sidebar";
import AttendanceHistory from "../components/sales/AttendanceHistory";

const StaffAttendanceHistory = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`d-flex app-container ${collapsed && window.innerWidth < 576 ? "sidebar-open" : ""}`}>
      {collapsed && window.innerWidth < 576 && (
        <div className="sidebar-overlay" onClick={() => setCollapsed(false)}></div>
      )}
      <Sidebar />
      <div className="main-content">
        <h2 className="text-center fw-bold mb-4">Lịch Sử Chấm Công</h2>
        <AttendanceHistory />
      </div>
    </div>
  );
};

export default StaffAttendanceHistory;
