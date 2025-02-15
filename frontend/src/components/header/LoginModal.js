import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const LoginModal = ({ show, setShow, setShowRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState({});
  const [pass, setPass] = useState({});
  const navigate = useNavigate();
  

  const getLogin = (email, password) => {
    return axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/sign-in`, {
      email: email,
      password: password
    })
  }

  const handelLogin = () => {
    getLogin(email, pass).then(function (response) {
      let data = response.data;
      if (data && !data.error) {
        if (data && data.access_token) {
          const token = data.access_token
          setCookie('token', token, 2)
          window.location.replace("/about");
        } else {

        }
      } else {

      }
    });
  }

  const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
            <div>
              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label text-dark">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="loginEmail" 
                  required 
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  />
              </div>
              <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label text-dark">Mật Khẩu</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="loginPassword"
                    required
                    onChange={(e) => {
                      setPass(e.target.value);
                    }}
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

              <button className="btn btn-dark w-100" onClick={handelLogin}>Đăng Nhập</button>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
