import React, { useState } from "react";
import axios from "axios";
import GoogleLoginComponent from "../GoogleLoginComponent";

const RegisterModal = ({ show, setShow, setShowLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(""); 
  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    email: "",
  });

  const isValidPassword = (password) => {
    const regex = /^(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };

  // Kiểm tên
  const isValidName = (name) => {
    const regex = /^[A-Za-zÀ-ỹ\s]+$/;
    return regex.test(name);
  };

  // Kiểm tra số điện thoại hợp lệ
  const isValidPhone = (phone) => {
    const regex = /^(03|05|08|09)\d{8}$/;
    return regex.test(phone);
  };

  // Kiểm tra email hợp lệ (phải là @gmail.com)
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
  };

  const handleSignup = (e) => {
    e.preventDefault(); 

    if(!user.name || !user.phone || !user.email || !user.password ||!user.confirmPassword) {
      setPasswordError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!isValidName(user.name)) {
        setPasswordError("Tên không được chứa số!");
        return;
    }
    
    if (!isValidPhone(user.phone)) {
      setPasswordError("Số điện thoại phải có 10 số và đúng định dạng!");
      return;
    }

    if (!isValidEmail(user.email)) {
      setPasswordError("Email phải có định dạng @gmail.com!");
      return;
    }

    if (!isValidPassword(user.password)) {
      setPasswordError("Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 chữ in hoa!");
      return;
    }

    if (user.password !== user.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp!");
      return;
    }

    axios
      .post(`${process.env.REACT_APP_URL_BACKEND}/user/sign-up`, user).then((response) => {
        const { data } = response;

        if (data.status === 'SUCCESS') {
          setShow(false);
          setShowLogin(true);
        } else {
          setPasswordError(data.message || "Có lỗi xảy ra, vui lòng thử lại!");
          console.error('Lỗi từ server:', data.message || "Không xác định");
        }
      })
      .catch((err) => {
        console.error("Lỗi đăng ký:", err.response ? err.response.data : err);
        setPasswordError("Không thể kết nối với server. Vui lòng thử lại!");
      });
  };

  const handleLoginSuccess = () => {
      setShow(false);
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered w-100 mx-auto" style={{ maxWidth: "500px" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-dark">Đăng Ký</h5>
            <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="registerName" className="form-label text-dark">Họ và Tên</label>
                <input 
                  type="text" 
                  className="form-control" 
                  title="Hãy nhập họ & tên" 
                  id="registerName" 
                  value={user.name} 
                  onChange={(e) => setUser({ ...user, name: e.target.value })} 
                />
              </div>

              <div className="mb-3">
                <label htmlFor="registerPhone" className="form-label text-dark">Số Điện Thoại</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  id="registerPhone" 
                  pattern="^(03|05|08|09)\d{8}$"
                  title="Số điện thoại phải có 10 số và đúng định dạng"
                  value={user.phone} 
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="registerEmail" className="form-label text-dark">Email</label>
                <input 
                  type="email"  
                  className="form-control" 
                  id="registerEmail" 
                  pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                  title="Email phải có định dạng @gmail.com"
                  value={user.email} 
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="registerPassword" className="form-label text-dark">Mật Khẩu</label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control pe-5"
                    id="registerPassword"
                    pattern="(?=.*[A-Z]).{8,}"
                    title="Mật khẩu phải có ít nhất 8 ký tự và bắt đầu bằng chữ cái viết hoa"
                    value={user.password} 
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                  />
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label text-dark">Xác Nhận Mật Khẩu</label>
                <div className="position-relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control pe-5"
                    id="confirmPassword"
                    pattern="(?=.*[A-Z]).{8,}"
                    title="Nhập lại mật khẩu"
                    value={user.confirmPassword}
                    onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                  />
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                  </span>
                </div>
                {passwordError && <p className="text-danger mt-1">{passwordError}</p>}
              </div>

              <button type="submit" className="btn btn-dark w-100 mb-3" onClick={handleSignup}>
                Đăng Ký
              </button>

              <p className="text-center text-dark">Hoặc đăng ký bằng Google</p>
              <div className="d-flex justify-content-center mb-3">
                <GoogleLoginComponent onSuccess={handleLoginSuccess} />
              </div>

              <div className="text-center">
                <p className="text-dark">
                  Đã có tài khoản?
                  <button
                    type="button"
                    className="btn btn-link text-primary text-decoration-none"
                    onClick={() => {
                      setShow(false);
                      setShowLogin(true);
                    }}
                  >
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
