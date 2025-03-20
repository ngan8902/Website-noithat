import React, { useState } from "react";

const EditResourceModal = ({ record, setAttendanceRecords, closeModal }) => {
  const [updatedRecord, setUpdatedRecord] = useState({ ...record });

  const calculateTotalHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "0h";

    const [inHours, inMinutes] = checkIn.split(":").map(Number);
    const [outHours, outMinutes] = checkOut.split(":").map(Number);

    let totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
    if (totalMinutes < 0) totalMinutes = 0; // Tránh trường hợp giờ ra < giờ vào

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`.trim();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...updatedRecord, [name]: value };

    if (name === "checkIn" || name === "checkOut") {
      updatedData.totalHours = calculateTotalHours(updatedData.checkIn, updatedData.checkOut);
    }

    setUpdatedRecord(updatedData);
  };

  const handleSave = () => {
    setAttendanceRecords((prevRecords) =>
      prevRecords.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
    );
    closeModal();
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chỉnh sửa chấm công</h5>
            <button className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Giờ vào</label>
              <input
                type="time"
                className="form-control"
                name="checkIn"
                value={updatedRecord.checkIn}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Giờ ra</label>
              <input
                type="time"
                className="form-control"
                name="checkOut"
                value={updatedRecord.checkOut}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tổng giờ làm</label>
              <input
                type="text"
                className="form-control"
                value={updatedRecord.totalHours}
                disabled
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={closeModal}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditResourceModal;
