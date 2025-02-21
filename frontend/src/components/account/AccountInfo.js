import React, { useState, useEffect } from "react";
import useAuthStore from '../../store/authStore';
import axios from 'axios';
import { getCookie } from "../../utils/cookie.util";
import { TOKEN_KEY } from '../../constants/authen.constant';

const AccountInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, auth, setUser } = useAuthStore((state) => state);
  const [avatar, setAvatar] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });


  // Lấy thông tin người dùng khi component render lần đầu
  useEffect(() => {
    auth();
  }, [auth]);

  // Cập nhật form khi có dữ liệu người dùng
  useEffect(() => {
    if (user && user._id) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });

      if (user && user.avatar) {
        setAvatar(user.avatar);
      }
    } else {
      console.error("Không tìm thấy thông tin người dùng hoặc thiếu id");
    }
  }, [user]);

  // Xử lý khi người dùng nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  // Hàm cập nhật Avatar lên server
  const updateAvatar = async (newAvatar) => {
    if (!user || !user._id) {
        console.log("Không tìm thấy thông tin người dùng");
        return;
    }

    try {
        const response = await axios.put(
            `${process.env.REACT_APP_URL_BACKEND}/user/update-user/${user._id}`,
            { avatar: newAvatar },  
            {
                headers: {
                    'token': getCookie(TOKEN_KEY)
                }
            }
        );

        console.log("Kết quả cập nhật avatar:", response.data);
        const { data } = response;
        if (data && data.data) {
            setUser(data.data);
            window.location.reload(); 
        }
    } catch (error) {
        console.log("Lỗi khi cập nhật avatar:", error)
    }
};


  const handleSave = async () => {
    if (!user || !user._id) {
      console.log("Không tìm thấy thông tin người dùng");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_URL_BACKEND}/user/update-user/${user._id}`,
        formData,
        {
          headers: {
            'token': getCookie(TOKEN_KEY)
          }
        }
      );

      console.log("Kết quả cập nhật:", response.data);
      const { data } = response;
      if (data && data.data) {
        setUser(data.data);  
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi cập nhật thông tin người dùng:", error);
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
            <input type="file" accept="image/*" hidden
              onChange={handleAvatarChange}
            />
          </label>
        </div>
      </div>

      {!isEditing ? (
        <div>
          <p><strong>Họ và Tên:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Số Điện Thoại:</strong> {user.phone}</p>
          <button className="btn btn-primary w-100" onClick={() => setIsEditing(true)}>
            Cập Nhật Thông Tin
          </button>
        </div>
      ) : (
        // Form chỉnh sửa thông tin
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
          <button className="btn btn-success w-100" type="button" onClick={handleSave}>
            Lưu Thay Đổi
          </button>
        </form>
      )}
    </div>
  );
};

export default AccountInfo;
