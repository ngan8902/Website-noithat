import React, { useState } from "react";
import Sidebar from "../components/sales/Sidebar";
import ResourceList from "../components/admin/ResourceList";

const Resource = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 1, employeeId: "NV001", name: "Nguyễn Văn A", date: "2024-02-01", checkIn: "08:00", checkOut: "17:00", status: "Đúng giờ", totalHours: "9h" },
    { id: 2, employeeId: "NV002", name: "Trần Thị B", date: "2024-02-01", checkIn: "08:15", checkOut: "17:30", status:"Muộn", totalHours: "9h 15m" },
  ]);

  return (
    <div className="d-flex app-container">
      <Sidebar />
        <div className="content p-4 main-content">
            <h2 className="text-center fw-bold mb-4">Quản lý Chấm Công</h2>
            <ResourceList 
                attendanceRecords={attendanceRecords} 
                setAttendanceRecords={setAttendanceRecords} 
            />
        </div>
    </div>
  );
};

export default Resource;
