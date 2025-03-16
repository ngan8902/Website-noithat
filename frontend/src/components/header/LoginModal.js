import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../utils/cookie.util";
import { TOKEN_KEY } from '../../constants/authen.constant';

const LoginModal = ({ show, setShow, setShowRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  
  const getLogin = (email, password) => {
    return axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/sign-in`, {
      email: email,
      password: password
    })
  }

  const handelLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !pass.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setErrorMessage("");

    getLogin(email, pass)
    .then((response) => {
      let data = response.data;
      if (data && !data.error) {
        if (data.access_token) {
          setCookie(TOKEN_KEY, data.access_token, 2)
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.replace("/account");
        } 
        else {
          setErrorMessage("Email hoặc mật khẩu không chính xác");
        }
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        setErrorMessage("Email hoặc mật khẩu không chính xác");
      } else {
        setErrorMessage("Không thể kết nối đến máy chủ, vui lòng kiểm tra lại mạng!");
      }
      setErrorMessage("");
    })
  }

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-dark">Đăng Nhập</h5>
            <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
          </div>
          <div className="modal-body">
          <form>
            <div>
              {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}

              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label text-dark">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="loginEmail" 
                  required 
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  />
              </div>
              <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label text-dark">Mật Khẩu</label>
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="loginPassword"
                    required
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                  </span>
                </div>
              </div>

              <button className="btn btn-dark w-100" type="submit" onClick={handelLogin} onKeyDown={(e) => e.key === "Enter" && handelLogin()}>Đăng Nhập</button>

              <div className="text-center mt-2">
                <button 
                  type="button" 
                  className="btn btn-link text-primary text-decoration-none"
                  onClick={() => navigate("/forgot-password")}
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="text-center mt-3">
                <p className="text-dark">
                  Chưa có tài khoản?
                  <button type="button" className="btn btn-link text-primary text-decoration-none" onClick={() => { setShow(false); setShowRegister(true); }}>
                    Tạo tài khoản
                  </button>
                </p>
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
