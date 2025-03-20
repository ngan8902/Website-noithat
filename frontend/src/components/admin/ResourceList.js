import React, { useState } from "react";
import EditResourceModal from "./EditResourceModal";

const ResourceList = ({ attendanceRecords, setAttendanceRecords }) => {
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openEditModal = (record) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecord(null);
    setModalOpen(false);
  };

  const filteredRecords = attendanceRecords.filter((record) =>
    record.employeeId.toString().includes(search) ||
    record.name.toLowerCase().includes(search.toLowerCase())
  );

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
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.employeeId}</td>
                <td>{record.name}</td>
                <td>{record.date}</td>
                <td>{record.checkIn}</td>
                <td>{record.checkOut}</td>
                <td>{record.totalHours}</td>
                <td className="fw-bold fs-5">
                  <span className={`badge ${record.status === "Đúng giờ" ? "text-success" : record.status === "Muộn" ? "text-danger" : "text-warning"}`}>
                    {record.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-warning btn-sm" onClick={() => openEditModal(record)}>
                    Sửa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">Không tìm thấy dữ liệu!</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalOpen && selectedRecord && (
        <EditResourceModal
          record={selectedRecord}
          setAttendanceRecords={setAttendanceRecords}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default ResourceList;
