import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../../utils/cookie.util";
import { STAFF_TOKEN_KEY } from "../../constants/authen.constant";

const AttendanceHistory = ({ staffId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

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
        setFilteredRecords(response.data.data);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); 
    return `${day}/${month}/${year}`;
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

  const generateRange = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const months = generateRange(1, 12);
  const currentYear = new Date().getFullYear();
  const years = generateRange(2024, currentYear);

  useEffect(() => {
    const filtered = records.filter(record => {
      const checkInDate = new Date(record.checkInTime);

      const matchDate = selectedDate
        ? new Date(selectedDate).toDateString() === checkInDate.toDateString()
        : true;

      const matchMonth = selectedMonth
        ? checkInDate.getMonth() + 1 === parseInt(selectedMonth)
        : true;

      const matchYear = selectedYear
        ? checkInDate.getFullYear() === parseInt(selectedYear)
        : true;

      return matchDate && matchMonth && matchYear;
    });

    setFilteredRecords(filtered);
  }, [selectedDate, selectedMonth, selectedYear, records]);

  const handleClearFilter = () => {
    setSelectedDate("");
    setSelectedMonth("");
    setSelectedYear("");
    setFilteredRecords(records);
  };

  const totalWorkingHours = filteredRecords.reduce((total, record) => {
    return total + calculateWorkingHours(record.checkInTime, record.checkOutTime);
  }, 0);

  return (
    <div id="users" className="mt-4">
      <div className="d-flex gap-2 align-items-end mb-3">
        <div className="col-md-3">
          <label className="form-label">Chọn ngày</label>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <select className="form-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">Tháng</option>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <select className="form-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">Năm</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <button className="btn btn-secondary" onClick={handleClearFilter}>Xóa lọc</button>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div style={{ border: "1px solid #ddd", maxHeight: "850px", overflow: "auto", overflowX: "auto" }}>
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
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.staffId.name}</td>
                <td>{formatDate(record.checkInTime)}</td>
                <td>{formatTime(record.checkInTime)}</td>
                <td className={formatTime(record.checkOutTime).includes("Chưa ra") ? "text-danger fw-bold" : ""}>
                  {formatTime(record.checkOutTime)}
                </td>
                <td>
                  {calculateWorkingHours(record.checkInTime, record.checkOutTime)}{" "}
                  giờ
                </td>
                <td>
                  <span
                    className={`badge ${
                      record.status === "present"
                        ? "text-success fw-bold"
                        : record.status === "late"
                        ? "text-danger fw-bold"
                        : "text-secondary"
                    }`}
                  >
                    {record.status === "present" ? "Đúng giờ" : record.status === "late" ? "Muộn" : "Không rõ"}
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

      {filteredRecords.length > 0 && (
        <div className="mt-3 fw-bold text-end">
          Tổng giờ công: <span className="text-primary">{totalWorkingHours} giờ</span>
        </div>
      )}

    </div>
  );
};

export default AttendanceHistory;
