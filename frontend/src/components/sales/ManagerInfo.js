import React, { useState } from "react";

const ManagerInfo = ({ staff }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <img
                  src={staff?.avatar || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                  alt={staff?.name || "Employee"}
                  className="rounded-circle mb-3 border border-3 border-primary avatar"
                  width="150"
                  height="150"
                  onClick={() => setShowModal(true)}
                  style={{ cursor: "pointer" }}
                />
                <h5 className="card-title">{staff?.name}</h5>
                <p className="card-text">
                  <i className="bi bi-envelope-fill me-2"></i> {staff?.email}
                </p>
                <p className="card-text">
                  <i className="bi bi-phone-vibrate-fill me-2"></i> {staff?.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-8 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold text-center">Thông Tin Chi Tiết</h5>
                <ul className="list-unstyled">
                  <li className="mb-2"><strong>Họ và Tên:</strong> {staff?.name}</li>
                  <li className="mb-2"><strong>Mã nhân viên:</strong> {staff?.staffcode || "Chưa cập nhật"}</li>
                  <li className="mb-2"><strong>Email:</strong> {staff?.email}</li>
                  <li className="mb-2"><strong>Số Điện Thoại:</strong> {staff?.phone}</li>
                  <li className="mb-2"><strong>Địa Chỉ:</strong> {staff?.address || "Chưa cập nhật"}</li>
                  <li className="mb-2"><strong>Ngày Sinh:</strong> {staff?.dob}</li>
                  <li className="mb-2"><strong>Giới Tính:</strong> {staff?.gender || "Chưa cập nhật"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Hiển Thị Ảnh */}
      {showModal && (
        <div className="avatar-modal">
          <div className="avatar-modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              <i className="bi bi-x"></i>
            </span>
            <img
              src={staff?.avatar || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
              alt="Avatar"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ManagerInfo;
