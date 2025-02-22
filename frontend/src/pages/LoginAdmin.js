import React, { useState } from "react";
import axios from "axios";
import { setCookie } from "../utils/cookie.util";
import { STAFF_TOKEN_KEY } from '../constants/authen.constant';

function LoginAdmin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const getLogin = (email, password) => {
        return axios.post(`${process.env.REACT_APP_URL_BACKEND}/staff/sign-in`, {
            username: username,
            password: password
        });
    };

    const handelLogin = () => {
        if (!username.trim() || !password.trim()) {
            setErrorMessage("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        setErrorMessage("");

        getLogin(username, password)
            .then((response) => {
                let data = response.data;
                if (data && !data.error) {
                    if (data.access_token) {
                        setCookie(STAFF_TOKEN_KEY, data.access_token, 2);
                        window.location.replace("/dashboard");
                    }
                }
            })
            .catch((error) => {
                console.error("Lỗi đăng nhập: ", error);
                if (error.response && error.response.status === 401) {
                    setErrorMessage("Tên đăng nhập hoặc mật khẩu không chính xác");
                } else {
                    setErrorMessage("Lỗi hệ thống, vui lòng thử lại!");
                }
            });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Trang Đăng Nhập Cho Nhân Viên</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                    </span>
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button onClick={handelLogin}>Đăng nhập</button>
            </div>
        </div>
    );
}

export default LoginAdmin;
