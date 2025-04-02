import React, { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import axios from "axios";
import { getCookie } from "../../utils/cookie.util";
import { TOKEN_KEY } from "../../constants/authen.constant";

const AccountInfo = () => {
  const { user, auth, setUser } = useAuthStore((state) => state);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isValidPassword = (password) => /^(?=.*[A-Z]).{8,}$/.test(password);
  const isValidName = (name) => /^[A-Za-zÀ-ỹ\s]+$/.test(name);
  const isValidPhone = (phone) => /^(03|05|08|09)\d{8}$/.test(phone);
  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  useEffect(() => {
    auth();
  }, [auth]);

  useEffect(() => {
    if (user && user._id) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      updateAvatar(file);
    }
  };


  const updateAvatar = async (file) => {
    if (!user?._id) return console.error("Không tìm thấy user");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await axios.put(
        `${process.env.REACT_APP_URL_BACKEND}/user/update-user/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: getCookie(TOKEN_KEY),
          },
        }
      );

      setUser(data.data);
    } catch (error) {
      console.error("Lỗi cập nhật avatar:", error);
    }
  };

  // Xử lý lưu thông tin user
  const handleSave = async () => {
    if (!user || !user._id) {
      console.log("Không tìm thấy thông tin người dùng");
      return;
    }

    if (!isValidName(formData.name)) {
      setErrorMessage("Tên không được chứa số!");
      return;
    }
    if (!isValidPhone(formData.phone)) {
      setErrorMessage("Số điện thoại phải có 10 số và đúng định dạng!");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setErrorMessage("Email phải có định dạng @gmail.com!");
      return;
    }

    try {
      const updatedData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_URL_BACKEND}/user/update-user/${user._id}`,
        updatedData,
        {
          headers: {
            'token': getCookie(TOKEN_KEY)
          }
        }
      );

      setUser(response.data.data);
      setIsEditing(false);
      setErrorMessage("Cập nhật thông tin thành công!");
      setTimeout(() => setErrorMessage(""), 3000);
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      setErrorMessage("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Cập nhật mật khẩu
  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      setErrorMessage("Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới.");
      return;
    }

    if (!isValidPassword(newPassword)) {
      setErrorMessage("Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 chữ in hoa!");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_URL_BACKEND}/user/update-password/${user._id}`,
        { currentPassword, newPassword },
        {
          headers: { token: getCookie(TOKEN_KEY) },
        }
      );

      if (response.data.status === "ERR") {
        setErrorMessage(response.data.message);
        return;
      }

      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setErrorMessage("Cập nhật thông tin thành công!");
      setTimeout(() => setErrorMessage(""), 3000);
    } catch (error) {
      console.error("Lỗi cập nhật mật khẩu:", error);
      const message = error?.response?.data?.message || "Có lỗi xảy ra!";
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleUpdateNewPassword = async () => {
    if (!newPassword && !confirmPassword) {
      setErrorMessage("Vui lòng nhập đầy đủ!");
      return;
    }

    if (!isValidPassword(newPassword)) {
      setErrorMessage("Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 chữ in hoa!");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_URL_BACKEND}/user/update-password/${user._id}`,
        { newPassword, confirmPassword },
        {
          headers: { token: getCookie(TOKEN_KEY) },
        }
      );

      if (response.data.status === "ERR") {
        setErrorMessage(response.data.message);
        return;
      }

      setIsChangingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage("Cập nhật thông tin thành công!");
      setTimeout(() => setErrorMessage(""), 3000);
    } catch (error) {
      console.error("Lỗi tạo mật khẩu:", error);
      const message = error?.response?.data?.message || "Có lỗi xảy ra!";
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="col-md-4 mb-4">
      <h5 className="fw-bold mb-3">Thông Tin Của Bạn</h5>

      <div className="text-center mb-3">
        <img
          alt="Avatar"
          className="avatar mb-3 rounded-circle border"
          height="150"
          src={avatar || "/images/logo.png"}
          width="150"
          onClick={() => setShowModal(true)}
          style={{ cursor: "pointer" }}
        />
        <div>
          <label className="btn btn-outline-primary position-relative">
            <i className="bi bi-camera"></i> Chọn ảnh
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </label>
        </div>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {!isEditing ? (
        <div>
          <div className="text-start">
            <p><i className="bi bi-person-circle text-dark m-2"></i> <strong>Họ và Tên:</strong> {user?.name}</p>
            <p><i className="bi bi-envelope text-dark m-2"></i> <strong>Email:</strong> {user?.email}</p>
            <p><i className="bi bi-telephone text-dark m-2"></i> <strong>Số Điện Thoại:</strong> {user?.phone}</p>
          </div>

          <button className="btn btn-primary w-100" onClick={() => setIsEditing(true)}>
            Cập Nhật Thông Tin
          </button>
        </div>
      ) : (
        <form>
          <div className="mb-3">
            <label className="form-label">Họ và Tên</label>
            <input className="form-control" name="name" type="text" value={formData.name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Số Điện Thoại</label>
            <input className="form-control" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
          </div>

          {/* Đổi mật khẩu */}
          {!isChangingPassword ? (
            <button
              type="button"
              className="btn btn-outline-danger w-100 mb-3 d-flex align-items-center justify-content-center"
              onClick={() => setIsChangingPassword(true)}
            >
              <i className="bi bi-lock-fill me-2"></i>
              {user?.password ? "Bạn muốn đổi mật khẩu?" : "Tạo mật khẩu của bạn!"}
            </button>
          ) : (
            <>
              {user?.password && (
                <div className="mb-3 position-relative">
                  <label className="form-label">Mật Khẩu Cũ</label>
                  <div className="input-group">
                    <input
                      className="form-control"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu cũ"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <span
                      className="input-group-text"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-3 position-relative">
                <label className="form-label">Mật Khẩu Mới</label>
                <div className="input-group">
                  <input
                    className="form-control"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                  </span>
                </div>
              </div>

              {!user.password && (
                <div className="mb-3 position-relative">
                  <label className="form-label">Nhập Lại Mật Khẩu</label>
                  <div className="input-group">
                    <input
                      className="form-control"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span
                      className="input-group-text"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="btn btn-outline-secondary w-100 mb-3"
                onClick={() => setIsChangingPassword(false)}
              >
                Hủy
              </button>

              <button
                className="btn btn-success w-100 m-1"
                type="button"
                onClick={user?.password ? handleUpdatePassword : handleUpdateNewPassword}
              >
                {user?.password ? "Cập Nhật Mật Khẩu" : "Tạo Mật Khẩu"}
              </button>
            </>
          )}
          <button className="btn btn-success w-100 m-1" type="button" onClick={handleSave}>
            Lưu Thay Đổi
          </button>
        </form>
      )}

      {/* Modal Hiển Thị Ảnh */}
      {showModal && (
        <div className="avatar-modal">
          <div className="avatar-modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              <i className="bi bi-x"></i>
            </span>
            <img
              src={user.avatar || "/images/logo.png"}
              alt="Avatar"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountInfo;
