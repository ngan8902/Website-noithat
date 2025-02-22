import React, { useState } from "react";
import axios from "axios";
import { setCookie } from "../utils/cookie.util";
import { STAFF_TOKEN_KEY } from '../constants/authen.constant';

function LoginAdmin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage,setErrorMessage] = useState("");

    const getLogin = (email, password) => {
        return axios.post(`${process.env.REACT_APP_URL_BACKEND}/staff/sign-in`, {
            username: username,
            password: password
        })
    }

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
                        setCookie(STAFF_TOKEN_KEY, data.access_token, 2)
                        window.location.replace("/dashboard");
                    }
                }
            })
            .catch((error) => {
                console.error("Lỗi đăng nhập: ", error);
                if (error.response && error.response.data === 401) {
                    setErrorMessage("Email hoặc mật khẩu không chính xác");
                } else {
                    setErrorMessage(`Lỗi: ${error.response.data.message}`);
                }
            })
    }


    return (
        <div className="App" id="loginpage">
            <header style={{ backgroundColor: "white" }}>
                <h1 className="text-login">Đăng Nhập</h1>
                <form>
                    <div>
                        <input
                            type="text"
                            id="staffusername"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            placeholder={"Tên đăng nhập"}
                        />
                        <label htmlFor="staffusername">
                            *
                        </label>
                    </div>

                    <div className="form-outline mb-4">
                        <input
                            type="password"
                            id="staffpassword"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            placeholder={"Mật khẩu"}
                        />
                        <label className="form-label" htmlFor="staffpassword">
                            *
                        </label>
                    </div>

                    <button
                        onClick={() => handelLogin()}
                        type="button"
                    >
                        Đăng nhập
                    </button>
                </form>
            </header>
        </div>
    );
}


export default LoginAdmin;
