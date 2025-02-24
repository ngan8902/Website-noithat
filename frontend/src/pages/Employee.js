import React, { useState } from "react";
import Sidebar from "../components/sales/Sidebar";
import EmployeeList from "../components/admin/EmployeeList";

const Employee = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Đỗ Khánh Thành", position: "CEO", email: "ceo@company.com", phone: "0123456789", dob: "2009-01-01", avatar: "/images/banner.png", address: "28 Lê Lai, Gò Vấp" },
    { id: 2, name: "Nguyễn Thị Bích Ngân", position: "Marketing", email: "mkt@company.com", phone: "0987654321", dob: "1990-01-01", avatar: "/images/banner.png" }
  ]);

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