import React from "react";

const AttendanceHistory = ({ records }) => {
  return (
    <div id="users" className="mt-4">
      <h5 className="fw-bold">Lịch sử chấm công</h5>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Nhân viên</th>
            <th>Ngày</th>
            <th>Giờ vào</th>
            <th>Giờ ra</th>
            <th>Tổng giờ làm</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record, index) =>
              <tr key={index}>
                <td>{record.employee}</td>
                <td>{record.date}</td>
                <td>{record.checkIn}</td>
                <td>{record.checkOut || "Chưa chấm"}</td>
                <td>{record.totalHours || "Đang tính toán"}</td>
                <td>
                  <span className={`badge ${record.status === "Đúng giờ" ? "bg-success" : record.status === "Muộn" ? "bg-danger" : "bg-warning"}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">Không có dữ liệu chấm công!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceHistory;
