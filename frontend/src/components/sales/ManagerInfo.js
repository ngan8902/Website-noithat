import React from "react";

const ManagerInfo = ({ user }) => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <img
                  src={user?.avatar || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                  alt={user?.name || "Employee"}
                  className="rounded-circle mb-3 border border-3 border-primary"
                  width="150"
                  height="150"
                />
                <h5 className="card-title">{user?.name}</h5>
                <p className="card-text"><i className="bi bi-person-fill">  </i>{user?.position || "Chưa cập nhật"}</p>
                <p className="card-text">
                  <i className="bi bi-envelope-fill me-2"></i> {user?.email}
                </p>
                <p className="card-text">
                  <i className="bi bi-phone-vibrate-fill me-2"></i> {user?.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-8 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold text-center">Thông Tin Chi Tiết</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <strong>Họ và Tên:</strong> {user?.name}
                  </li>
                  <li className="mb-2">
                    <strong>Mã nhân viên:</strong> {user?.staffcode || "Chưa cập nhật"}
                  </li>
                  <li className="mb-2">
                    <strong>Chức Vụ:</strong> {user?.position || "Chưa cập nhật"}
                  </li>
                  <li className="mb-2">
                    <strong>Email:</strong> {user?.email}
                  </li>
                  <li className="mb-2">
                    <strong>Số Điện Thoại:</strong> {user?.phone}
                  </li>
                  <li className="mb-2">
                    <strong>Địa Chỉ:</strong> {user?.address || "Chưa cập nhật"}
                  </li>
                  <li className="mb-2">
                    <strong>Ngày Sinh:</strong> {user?.dob}
                  </li>
                  <li className="mb-2">
                    <strong>Giới Tính:</strong> {user?.gender}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagerInfo;
