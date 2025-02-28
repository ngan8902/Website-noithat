import React, { useState } from "react";
import Sidebar from "../components/sales/Sidebar";
import EmployeeList from "../components/admin/EmployeeList";

const Employee = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Nguyễn A", position: "Sale Manager", email: "text@company.com", phone: "0123456789", dob: "2009-01-01", gender: "Nam", avatar: "/images/banner.png", address: "28 Lê Lai, Gò Vấp" },
    { id: 2, name: "Nguyễn Thị Bích Ngân", position: "Marketing", email: "bn@company.com", phone: "0987654321", dob: "1990-01-01", gender: "Nữ", avatar: "/images/banner.png", address: "HCM" }
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