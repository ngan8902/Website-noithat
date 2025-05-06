import React, { useState } from "react";
import axios from "axios";
import { setCookie } from "../utils/cookie.util";
import { STAFF_TOKEN_KEY } from "../constants/authen.constant";

function LoginAdmin() {
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const getLogin = (username, password) => {
        return axios.post(`${process.env.REACT_APP_URL_BACKEND}/staff/sign-in`, {
            username: username,
            password: password,
        });
    };

    const handelLogin = (e) => {
        e?.preventDefault();
        if (!username.trim() || !pass.trim()) {
            setErrorMessage("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        setErrorMessage("");

        getLogin(username, pass)
            .then((response) => {
                const data = response.data;
                if (data?.access_token) {
                    setCookie(STAFF_TOKEN_KEY, data.access_token, 2);
                    window.location.replace("/admin/dashboard");
                } else {
                    setErrorMessage("Tên đăng nhập hoặc mật khẩu không chính xác");
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

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handelLogin(e);
        }
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
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                    </span>
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button onClick={handelLogin} onKeyDown={(e) => e.key === "Enter" && handelLogin()}>Đăng nhập</button>
            </div>
        </div>
    );
}

export default LoginAdmin;
