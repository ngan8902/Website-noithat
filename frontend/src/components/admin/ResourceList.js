import React, { useState, useEffect } from "react";
import axios from "axios";
import EditResourceModal from "./EditResourceModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function removeVietnameseTones(str) {
  return str.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

const ResourceList = () => {
  const [attendanceRecords, setAttendance] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchStatus, setSearchStatus] = useState("");


  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/attendance/all-attendance`,);
      console.log(response)
      setAttendance(response.data.data);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);


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
    const year = String(date.getFullYear());
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

  const resetFilters = () => {
    setSearchKeyword("");
    setSearchDate("");
    setSearchMonth("");
    setSearchYear("");
    setSearchStatus("");
  };

  const filteredRecords = attendanceRecords?.filter((record) => {
    const keywordNormalized = removeVietnameseTones(searchKeyword || "");
    const staffcode = removeVietnameseTones(record.staffcode?.toString() || "");
    const staffName = removeVietnameseTones(record.staffId?.name || "");

    const matchesKeyword =
      staffcode.includes(keywordNormalized) ||
      staffName.includes(keywordNormalized);

    const recordDate = new Date(record.checkInTime);
    const recordDay = recordDate.toISOString().split("T")[0];
    const recordMonth = recordDate.getMonth() + 1;
    const recordYear = recordDate.getFullYear();

    const matchesDate = searchDate ? recordDay === searchDate : true;
    const matchesMonth = searchMonth
      ? recordMonth === Number(searchMonth)
      : true;
    const matchesYear = searchYear ? recordYear === Number(searchYear) : true;
    const matchesStatus = searchStatus ? record.status === searchStatus : true;

    return matchesKeyword && matchesDate && matchesMonth && matchesYear && matchesStatus;
  });

  const totalWorkingHours = filteredRecords.reduce((sum, record) => {
    return sum + calculateWorkingHours(record.checkInTime, record.checkOutTime);
  }, 0);

  const exportToExcel = () => {
    const dataToExport = filteredRecords.map((record) => ({
      "ID": record.staffcode,
      "Tên nhân viên": record.staffId.name,
      "Ngày chấm công": formatDate(record.checkInTime),
      "Giờ vào": formatTime(record.checkInTime),
      "Giờ ra": formatTime(record.checkOutTime),
      "Tổng giờ làm": calculateWorkingHours(record.checkInTime, record.checkOutTime),
      "Trạng thái": record.status === "present" ? "Đúng giờ" : record.status === "late" ? "Muộn" : "Nghỉ",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachChamCong");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "ChamCong.xlsx");
  };

  return (
    <div id="attendance" className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Danh Sách Chấm Công</h5>
        <button className="btn btn-success" onClick={exportToExcel}> <i className="bi bi-box-arrow-down"></i> Xuất Excel </button>
      </div>

      <div className="d-flex gap-2 align-items-end mb-3">
        {/* <div className="row g-2"> */}
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo ID hoặc tên"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={searchMonth}
            onChange={(e) => setSearchMonth(e.target.value)}
          >
            <option value="">-- Tháng --</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
          >
            <option value="">-- Năm --</option>
            {[2024, 2025].map((year) => (
              <option key={year} value={year}>
                Năm {year}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-1.5">
          <select
            className="form-select"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <option value="">-- Trạng Thái --</option>
            <option value="present">Đúng giờ</option>
            <option value="late">Muộn</option>
            <option value="off">Nghỉ</option>
          </select>
        </div>

        <div className="col-md-2">
          <button className="btn btn-secondary w-100" onClick={resetFilters}>
            Xóa bộ lọc
          </button>
        </div>
        {/* </div> */}
      </div>
      <div style={{
        border: "1px solid #ddd",
        maxHeight: "850px",
        overflow: "auto",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}>
        <style>
          {`
      div::-webkit-scrollbar {
        display: none;             
      }
    `}
        </style>
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Tên Nhân Viên</th>
              <th>Ngày Chấm Công</th>
              <th>Giờ Vào</th>
              <th>Giờ Ra</th>
              <th>Tổng Giờ Làm</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              [...filteredRecords]
                .sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime))
                .map((record) => (
                  <tr key={record._id}>
                    <td>{record.staffcode}</td>
                    <td>{record.staffId?.name}</td>
                    <td>{formatDate(record.checkInTime)}</td>
                    <td>{formatTime(record.checkInTime)}</td>
                    <td className={formatTime(record.checkOutTime).includes("Chưa ra") ? "text-danger fw-bold" : ""}>
                      {formatTime(record.checkOutTime)}
                    </td>
                    <td>
                      {calculateWorkingHours(record.checkInTime, record.checkOutTime)}{" "}
                      giờ
                    </td>
                    <td className="fw-bold fs-5">
                      <span
                        className={`badge ${record.status === "present"
                          ? "text-success"
                          : record.status === "late"
                            ? "text-danger"
                            : "text-danger"
                          }`}
                      >
                        {record.status === "present" ? "Đúng giờ" : record.status === "late" ? "Muộn" : "Nghỉ"}
                      </span>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">Không tìm thấy dữ liệu!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-end fw-bold">
        Tổng số giờ công (dựa trên kết quả lọc): <span className="text-primary"> {totalWorkingHours} giờ </span>
      </div>
    </div>
  );
};

export default ResourceList;
