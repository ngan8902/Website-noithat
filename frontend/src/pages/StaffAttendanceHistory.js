import React from "react";
import Sidebar from "../components/sales/Sidebar";
import AttendanceHistory from "../components/sales/AttendanceHistory";

const StaffAttendanceHistory = () => {
  const records = [
    { id: 1, employee: "A B C", date: "01/02/2025", checkIn: "08:00", checkOut: "17:00", totalHours: "9h", status: "Đúng giờ" },
    { id: 1, employee: "A B C", date: "02/02/2025", checkIn: "08:10", checkOut: "17:10", totalHours: "9h'", status: "Muộn" },
  ];

  return (
    <div className="d-flex app-container">
      <Sidebar />
      <div className="content p-4 main-content">
        <AttendanceHistory records={records} />
      </div>
    </div>
  );
};

export default StaffAttendanceHistory;
