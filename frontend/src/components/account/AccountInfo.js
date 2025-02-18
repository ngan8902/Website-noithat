import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../../utils/cookie.util";
import { TOKEN_KEY } from '../../constants/authen.constant';

const AccountInfo = ({ user, setUser }) => {
  const [editUser, setEditUser] = useState(user || {});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = getCookie(TOKEN_KEY);

    axios.get(`${process.env.REACT_APP_URL_BACKEND}/user/getme`, {
      headers: { token: `Bearer ${token}` },
    })
    .then((response) => {
      console.log("Dữ liệu nhận được:", response.data);
      setEditUser(response.data);
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    });
  }, []);

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
        setEditUser(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = getCookie(TOKEN_KEY);

      await axios.put(`${process.env.REACT_APP_URL_BACKEND}/user/update-user/${editUser.id}`, editUser, {
        headers: { token: `Bearer ${token}` },
      });

      setUser(editUser);
      localStorage.setItem("user", JSON.stringify(editUser));
      setIsEditing(false);
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
          <p><strong>Họ và Tên:</strong> {editUser.name}</p>
          <p><strong>Email:</strong> {editUser.email}</p>
          <p><strong>Số Điện Thoại:</strong> {editUser.phone}</p>
          <button className="btn btn-primary w-100" onClick={() => setIsEditing(true)}>
            Cập Nhật Thông Tin
          </button>
        </div>
      ) : (
        // Form chỉnh sửa thông tin
        <form>
          <div className="mb-3">
            <label className="form-label">Họ và Tên</label>
            <input className="form-control" name="name" type="text" value={editUser.name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" name="email" type="email" value={editUser.email} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Số Điện Thoại</label>
            <input className="form-control" name="phone" type="tel" value={editUser.phone} onChange={handleChange} />
          </div>
          <button className="btn btn-success w-100" type="button" onClick={handleSave}>
            Lưu Thay Đổi
          </button>
        </form>
      )}
    </div>
  );
};

export default AccountInfo;
