import React, { useState } from "react";
import Sidebar from "../components/sales/Sidebar";
import EmployeeList from "../components/admin/EmployeeList";

const Employee = () => {
  const [employees, setEmployees] = useState([]);

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`d-flex app-container ${collapsed && window.innerWidth < 576 ? "sidebar-open" : ""}`}>
      {collapsed && window.innerWidth < 576 && (
        <div className="sidebar-overlay" onClick={() => setCollapsed(false)}></div>
      )}
      <Sidebar />
      <div className="content p-4 main-content">
        <h2 className="text-center fw-bold mb-4">Quản Lý Nhân Viên</h2>
        <EmployeeList employees={employees} setEmployees={setEmployees} />
      </div>
    </div>
  );
};

export default Employee;