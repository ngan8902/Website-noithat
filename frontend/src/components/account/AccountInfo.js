import React, { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import axios from "axios";
import { getCookie } from "../../utils/cookie.util";
import { TOKEN_KEY } from "../../constants/authen.constant";

const AccountInfo = () => {
  const { user, auth, setUser } = useAuthStore((state) => state);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [, setErrorMessage] = useState("");
  const [avatar, setAvatar] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

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

  // Xử lý đổi avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result;
        setAvatar(newAvatar);
        updateAvatar(newAvatar);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gửi request cập nhật avatar
  const updateAvatar = async (newAvatar) => {
    if (!user?._id) return console.error("Không tìm thấy user");

    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_URL_BACKEND}/user/update-user/${user._id}`,
        { avatar: newAvatar },
        {
          headers: { token: getCookie(TOKEN_KEY) },
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

      console.log("Cập nhật thành công:", response.data);
      setUser(response.data.data);
      setIsEditing(false);
      setErrorMessage("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      setErrorMessage("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!");
    }
  };

  // Cập nhật mật khẩu
  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới.");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_URL_BACKEND}/user/update-user/${user._id}`,
        { currentPassword, newPassword },
        {
          headers: { token: getCookie(TOKEN_KEY) },
        }
      );

      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Lỗi cập nhật mật khẩu:", error);
      const message = error?.response?.data?.message || "Có lỗi xảy ra!";
      setErrorMessage(message);
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
        />
        <div>
          <label className="btn btn-secondary">
            Đổi ảnh đại diện
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </label>
        </div>
      </div>

      {!isEditing ? (
        <div>
          <p><strong>Họ và Tên:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Số Điện Thoại:</strong> {user?.phone}</p>
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
              className="btn btn-outline-danger w-100 mb-3"
              onClick={() => setIsChangingPassword(true)}
            >
              Bạn muốn đổi mật khẩu?
            </button>
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label">Mật Khẩu Cũ</label>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Nhập mật khẩu cũ"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mật Khẩu Mới</label>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              {error && <div className="text-danger">{error}</div>}
              <button
                type="button"
                className="btn btn-outline-secondary w-100 mb-3"
                onClick={() => setIsChangingPassword(false)}
              >
                Hủy đổi mật khẩu
              </button>
              <button className="btn btn-success w-100 m-1" type="button" onClick={handleUpdatePassword}>
                Cập Nhật Mật Khẩu
              </button>
            </>
          )}

          <button className="btn btn-success w-100 m-1" type="button" onClick={handleSave}>
            Lưu Thay Đổi
          </button>
        </form>
      )}
    </div>
  );
};

export default AccountInfo;
