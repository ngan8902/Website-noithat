import React from "react";
import { Link } from "react-router-dom";

import axiosClient from "../utils/fetch.utils";

function Login() {
  const [Username, setUsername] = React.useState("");
  const [Password, setPassword] = React.useState("");
  
  let getLogin = (username, password, token) => {
    return axiosClient.post('/api/shop/login', {
      username: username,
      password: password,
      token: token,
    })
  };

  let submit = () => {
    getLogin(Username, Password).then(function (response) {
      //  console.log(response);
      let data = response.data;
      if (data && !data.error) {
        if(data && data.data) {
          const token = data.data.token
          window.localStorage.setItem('tokenshop', token)
          axiosClient.defaults.headers.common['authorization-shop'] = token;
          window.location.reload()
        } else {

        }
      } else {

      }
    });
  };

  return (
    <div className="App" id="loginpage">
      <header className="App-header" style={{ backgroundColor: "white" }}>
        <h1 className="text-login">Đăng Nhập</h1>
        <form className="from-login">
          <div className="form-outline mb-4">
            <input
              type="text"
              id="form2Example1"
              value={Username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="form-control"
              placeholder={"Tên đăng nhập"}
            />
            <label className="form-label" htmlFor="form2Example1">
              *
            </label>
          </div>

          <div className="form-outline mb-4">
            <input
              type="password"
              id="form2Example2"
              value={Password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="form-control"
              placeholder={"Mật khẩu"}
            />
            <label className="form-label" htmlFor="form2Example2">
              *
            </label>
          </div>

          <div className="row mb-2">
            <div className="col">
              <Link to="/admin/login/signup" style={{ fontSize: "1rem" }}>
                Đăng ký tài khoản mới!
              </Link>
            </div>
          </div>

          <button
            onClick={() => {
              submit();
            }}
            type="button"
            className="btn-đn btn-block mb-4"
          >
            Đăng nhập
          </button>
        </form>
      </header>
    </div>
  );
}


export default Login;
