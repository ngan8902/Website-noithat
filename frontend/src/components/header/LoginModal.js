import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import {useMutation} from "@tanstack/react-query";
// import * as UserService from "../../service/UserService"

const LoginModal = ({ show, setShow, setShowRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  


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
              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label text-dark">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="loginEmail" 
                  required 
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

              <button type="submit" className="btn btn-dark w-100" >Đăng Nhập</button>

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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
