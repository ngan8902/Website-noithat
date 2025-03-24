import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP, 3: Đặt lại mật khẩu
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isValidPassword = (newPassword) => {
    const regex = /^(?=.*[A-Z]).{8,}$/;
    return regex.test(newPassword);
  };

 // Gửi email để nhận mã OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Vui lòng nhập email của bạn!");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setMessage("");

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/auth/forgot-password`, { email },);

        if (response.data.status === "ERR") {
            setErrorMessage(response.data.message);
            return;
        }

        if (response.data.status === "OK") {
            setMessage("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!");
            setStep(2);
        } else {
            setErrorMessage("Không thể gửi mã OTP. Vui lòng thử lại!");
        }
    } catch (error) {
        if (error.response && error.response.data) {
            setErrorMessage(error.response.data.message || "Đã xảy ra lỗi, vui lòng thử lại!");
        } else {
            setErrorMessage("Lỗi kết nối đến máy chủ. Vui lòng thử lại!");
        }
    }

    setLoading(false);
  };

  // Xác thực mã OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrorMessage("Vui lòng nhập mã OTP!");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setMessage("");

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/auth/verify-otp`, { email, otp });

      if (response.data.status === "ERR") {
        setErrorMessage(response.data.message);
        return;
      }

      if (response.data.status === "OK") {
        setMessage("Xác minh OTP thành công! Bạn có thể đặt lại mật khẩu.");
        setStep(3);
      } else {
        setErrorMessage("Mã OTP không hợp lệ, vui lòng thử lại!");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Lỗi kết nối đến máy chủ. Vui lòng thử lại!");
    }

    setLoading(false);
  };

  // Đặt lại mật khẩu mới
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!isValidPassword(newPassword)) {
      setErrorMessage("Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 chữ in hoa!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setMessage("");

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/auth/reset-password`, {
        email,
        newPassword,
      });

      if (response.data.status === "OK") {
        setMessage("Mật khẩu đã được cập nhật. Hãy đăng nhập lại!");
        setTimeout(() => navigate("/home"), 3000);
      } else {
        setErrorMessage(response.data.message || "Không thể đặt lại mật khẩu!");
      }
    } catch (error) {
      setErrorMessage("Lỗi kết nối đến máy chủ. Vui lòng thử lại!");
    }

    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-sm col-12 col-md-6 col-lg-4">
        <h4 className="text-center">Quên Mật Khẩu</h4>

        {step === 1 && <p className="text-center">Nhập email để nhận mã OTP đặt lại mật khẩu.</p>}
        {step === 2 && <p className="text-center">Nhập mã OTP được gửi đến email của bạn.</p>}
        {step === 3 && <p className="text-center">Nhập mật khẩu mới của bạn.</p>}

        {message && <div className="alert alert-success">{message}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        {/* Bước 1: Nhập Email */}
        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi mã OTP"}
            </button>
          </form>
        )}

        {/* Bước 2: Nhập mã OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-3">
              <label className="form-label">Mã OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? "Đang xác thực..." : "Xác nhận OTP"}
            </button>
          </form>
        )}

        {/* Bước 3: Đặt lại mật khẩu */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="password-container">
              <div className="mb-3 position-relative">
                <label className="form-label">Mật khẩu mới</label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span
                    className="toggle-password position-absolute"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    >
                    {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                  </span>
                  </div>
              </div>
            </div>
            <div className="password-container">
              <div className="mb-3 position-relative">
                <label className="form-label">Xác nhận mật khẩu</label>
                <div className="position-relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="toggle-password position-absolute"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showConfirmPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                  </span>
                </div>
              </div>
            </div>
            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
