import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ManagerInfo = ({ manager }) => {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Phản hồi đã được gửi!");
    setShowForm(false);
    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("");
    navigate("/admin/login");
  };

  return (
    <div id="info" className="manager-info mt-4 p-3 border rounded bg-light position-relative">
      <h5 className="fw-bold text-center">Thông Tin Nhân Viên</h5>

      <div className="d-flex flex-column align-items-center mt-3">
        <img
          src={manager.avatar}
          alt="Avatar"
          className="rounded-circle"
          width="150"
          height="150"
        />
        <div className="mt-3 text-center">
          <p className="mb-1"><strong>Mã Nhân Viên:</strong> {manager.id}</p>
          <p className="mb-1"><strong>Họ và Tên:</strong> {manager.name}</p>
          <p className="mb-1"><strong>Ngày Sinh:</strong> {manager.dob}</p>
          <p className="mb-1"><strong>Email:</strong> {manager.email}</p>
          <p className="mb-1"><strong>Số Điện Thoại:</strong> {manager.phone}</p>
        </div>
      </div>

      <button 
        className="btn btn-warning feedback-btn"
        onClick={() => setShowForm(!showForm)}
      >
        📝 Phản hồi
      </button>

      {showForm && (
        <div className="feedback-form p-3 border rounded bg-white">
          <h6 className="fw-bold">Gửi Phản Hồi</h6>
          <form onSubmit={handleSubmit}>
            <textarea 
              className="form-control mb-2"
              placeholder="Nhập nội dung phản hồi..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary btn-sm">Gửi</button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm ms-2"
              onClick={() => setShowForm(false)}
            >
              Hủy
            </button>
          </form>
        </div>
      )}

      <button 
        className="btn btn-danger mt-3 logout-btn"
        onClick={handleLogout}
      >
       Đăng Xuất
      </button>
    </div>
  );
};

export default ManagerInfo;
