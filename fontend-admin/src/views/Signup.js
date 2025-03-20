function Signup () {

    return (
        <div className="App" id="signuppage">
          <header className="App-header" style={{ backgroundColor: "white" }}>
            <h1 className="text-signup">Đăng Ký Tài Khoản</h1>
            <form className="from-login mb-8">
              <div className="form-outline mb-4">
                <input
                  type="text"
                  id="form2Example1"
                  className="form-control"
                  placeholder={"Tên đăng nhập"}
                />
              </div>

              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="form2Example1"
                  className="form-control"
                  placeholder={"Địa chỉ Email"}
                />
              </div>

              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="form2Example2"
                  className="form-control"
                  placeholder={"Mật khẩu"}
                />
              </div>

              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="form2Example2"
                  className="form-control"
                  placeholder={"Nhập lại mật khẩu"}
                />
              </div>
    
              <button
                type="button"
                className="btn-đk btn-block mb-4"
              >
                Đăng Ký
              </button>
            </form>
          </header>
        </div>
      );
}

export default Signup;