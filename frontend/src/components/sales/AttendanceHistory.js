import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../../utils/cookie.util";
import { STAFF_TOKEN_KEY } from "../../constants/authen.constant";

const AttendanceHistory = ({ staffId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = getCookie(STAFF_TOKEN_KEY);

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${process.env.REACT_APP_URL_BACKEND}/attendance/${staffId}`,
          {
            headers: { 'staff-token': token },
            withCredentials: true
          }
        );

        setRecords(response.data.data);
      } catch (error) {
        console.error(error);
        setError("Không thể lấy dữ liệu lịch sử điểm danh.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAttendanceHistory();
    } else {
      setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
      setLoading(false);
    }
  }, [staffId, token]);

  const formatTime = (time) => {
    if (!time) return 'Chưa ra';
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const calculateWorkingHours = (checkInTime, checkOutTime) => {
    if (checkInTime && checkOutTime) {
      const checkIn = new Date(checkInTime);
      const checkOut = new Date(checkOutTime);
      const hoursWorked = (checkOut - checkIn) / (1000 * 60 * 60);

      const roundedHours = Math.round(hoursWorked);
      return roundedHours;
    }
    return 0;
  };

  return (
    <div id="users" className="mt-4">
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-danger">{error}</p>}

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
            records.map((record, index) => (
              <tr key={index}>
                <td>{record.staffId.name}</td>
                <td>{new Date(record.checkInTime).toLocaleDateString()}</td>
                <td>{formatTime(record.checkInTime)}</td>
                <td>{formatTime(record.checkOutTime)}</td>
                <td>
                  {calculateWorkingHours(record.checkInTime, record.checkOutTime)}{" "}
                  giờ
                </td>
                <td>
                  <span
                    className={`badge ${record.status === "Đúng giờ"
                      ? "text-success"
                      : record.status === "Muộn"
                        ? "text-danger"
                        : "text-danger"
                      }`}
                  >
                    {record.status === "Đúng giờ" ? "Đúng giờ" : "Muộn"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                Không có dữ liệu chấm công!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceHistory;
