import React, { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import axios from "axios";
import { getCookie } from "../../utils/cookie.util";
import { TOKEN_KEY } from "../../constants/authen.constant";

const AccountInfo = () => {
  const { user, auth } = useAuthStore();
  const [editUser, setEditUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(""); 
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    auth();
  }, [auth]);

  useEffect(() => {
    setEditUser(user || {});
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditUser((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = getCookie(TOKEN_KEY);

      const updatedUser = { ...editUser };
      if (isChangingPassword) {
        if (!currentPassword || !newPassword) {
          alert("Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới!");
          return;
        }
        updatedUser.currentPassword = currentPassword;
        updatedUser.newPassword = newPassword;
      }

      await axios.put(`${process.env.REACT_APP_URL_BACKEND}/user/update-user/${editUser.id}`, updatedUser, {
        headers: { token: `Bearer ${token}` },
      });

      auth(); // Cập nhật lại dữ liệu user sau khi update
      setIsEditing(false);
      setIsChangingPassword(false);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Cập nhật thất bại!");
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
          src={editUser.avatar || "/images/logo.png"}
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
            <input className="form-control" name="name" type="text" value={editUser.name || ""} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" name="email" type="email" value={editUser.email || ""} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Số Điện Thoại</label>
            <input className="form-control" name="phone" type="tel" value={editUser.phone || ""} onChange={handleChange} />
          </div>

          {/* Nút đổi mật khẩu */}
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
              <button
                type="button"
                className="btn btn-outline-secondary w-100 mb-3"
                onClick={() => setIsChangingPassword(false)}
              >
                Hủy đổi mật khẩu
              </button>
            </>
          )}

          <button className="btn btn-success w-100" type="button" onClick={handleSave}>
            Lưu Thay Đổi
          </button>
        </form>
      )}
    </div>
  );
};

export default AccountInfo;
