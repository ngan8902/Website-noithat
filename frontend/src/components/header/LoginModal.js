import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../utils/cookie.util";
import { TOKEN_KEY } from '../../constants/authen.constant';
import GoogleLoginComponent from "../GoogleLoginComponent";

const LoginModal = ({ show, setShow, setShowRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const getLogin = (email, password) => {
    return axios.post(
      `${process.env.REACT_APP_URL_BACKEND}/user/sign-in`,
      { email, password },
      { withCredentials: true }
    );
  };

  const handelLogin = (e) => {
    e?.preventDefault();

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

  const handleLoginSuccess = () => {
    setShow(false);
  };

  return (
    <div className="modal d-block" tabIndex="-1">
      <div
        className="modal-dialog modal-dialog-centered w-100 mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-dark">Đăng Nhập</h5>
            <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
          </div>
          <div className="modal-body">
            <form>
              {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}

              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label text-dark">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="loginEmail"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label text-dark">Mật Khẩu</label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control pe-5"
                    id="loginPassword"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
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

              <button className="btn btn-dark w-100" type="submit" onClick={handelLogin}>
                Đăng Nhập
              </button>

              <div className="text-center mt-2">
                <button
                  type="button"
                  className="btn btn-link text-primary text-decoration-none"
                  onClick={() => navigate("/forgot-password")}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <p className="text-center text-dark mt-3">Hoặc đăng nhập bằng</p>

              <div className="d-flex justify-content-center">
                <GoogleLoginComponent onSuccess={handleLoginSuccess} />
              </div>

              <div className="text-center mt-3">
                <p className="text-dark">
                  Chưa có tài khoản?
                  <button
                    type="button"
                    className="btn btn-link text-primary text-decoration-none"
                    onClick={() => {
                      setShow(false);
                      setShowRegister(true);
                    }}
                  >
                    Tạo tài khoản
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

export default LoginModal;
