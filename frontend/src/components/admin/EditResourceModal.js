import React, { useState } from "react";

const EditResourceModal = ({ record, setAttendanceRecords, closeModal }) => {
  const [updatedRecord, setUpdatedRecord] = useState({ ...record });

  const handleChange = (e) => {
    setUpdatedRecord({ ...updatedRecord, [e.target.name]: e.target.value });
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
