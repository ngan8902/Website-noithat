import React, { useState } from "react";

const RegisterModal = ({ show, setShow, setShowLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-dark">Đăng Ký</h5>
            <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="registerName" className="form-label text-dark">Họ và Tên</label>
                <input type="text" className="form-control" id="registerName" required />
              </div>
              <div className="mb-3">
                <label htmlFor="registerPhone" className="form-label text-dark">Số Điện Thoại</label>
                <input type="tel" className="form-control" id="registerPhone" required pattern="^\d{10}$" title="Số điện thoại phải có 10 chữ số" />
              </div>
              <div className="mb-3">
                <label htmlFor="registerEmail" className="form-label text-dark">Email</label>
                <input type="email" className="form-control" id="registerEmail" required />
              </div>
              <div className="mb-3">
                <label htmlFor="registerPassword" className="form-label text-dark">Mật Khẩu</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="registerPassword"
                    required
                    pattern="(?=.*[A-Z]).{8,}"
                    title="Mật khẩu phải có ít nhất 8 ký tự và bắt đầu bằng chữ cái viết hoa"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-dark w-100 mb-3">Đăng Ký</button>
              <div className="text-center mt-3">
                <p className="text-dark">
                  Đã có tài khoản?
                  <button type="button" className="btn btn-link text-primary text-decoration-none" onClick={() => { setShow(false); setShowLogin(true); }}>
                    Đăng nhập
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
