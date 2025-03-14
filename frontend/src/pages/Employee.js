import React, { useState } from "react";
import Sidebar from "../components/sales/Sidebar";
import EmployeeList from "../components/admin/EmployeeList";

const Employee = () => {
  const [employees, setEmployees] = useState([]);

  return (
    <div className="d-flex app-container">
      <Sidebar />
      <div className="content p-4 main-content">
        <h2 className="text-center fw-bold mb-4">Quản Lý Nhân Sự</h2>
        <EmployeeList employees={employees} setEmployees={setEmployees} />
      </div>
    </div>
  );
};

export default Employee;