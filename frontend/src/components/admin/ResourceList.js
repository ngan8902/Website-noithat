import React, { useState, useEffect } from "react";
import axios from "axios";
import EditResourceModal from "./EditResourceModal";

const ResourceList = ({ setAttendanceRecords }) => {
  const [attendanceRecords, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/attendance/all-attendance`);
      setAttendance(response.data.data);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const closeModal = () => {
    setSelectedRecord(null);
    setModalOpen(false);
  };

  const filteredRecords = attendanceRecords?.filter((record) =>
    record.staffcode.toString().includes(search) ||
    record?.name?.toLowerCase().includes(search?.toLowerCase())
  );

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
    <div id="attendance" className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Danh Sách Chấm Công</h5>
      </div>

      <div className="input-group mt-2">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm theo ID, tên nhân viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
            filteredRecords.map((record) => (
              <tr key={record._id}>
                <td>{record.staffcode}</td>
                <td>{record.staffId.name}</td>
                <td>{new Date(record.checkInTime).toLocaleDateString()}</td>
                <td>{formatTime(record.checkInTime)}</td>
                <td>{formatTime(record.checkOutTime)}</td>
                <td>
                  {calculateWorkingHours(record.checkInTime, record.checkOutTime)}{" "}
                  giờ
                </td>
                <td className="fw-bold fs-5">
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
              <td colSpan="8" className="text-center text-muted">Không tìm thấy dữ liệu!</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalOpen && selectedRecord && (
        <EditResourceModal
          record={selectedRecord}
          setAttendanceRecords={setAttendance}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default ResourceList;
