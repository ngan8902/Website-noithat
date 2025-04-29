import React, { useState, useEffect } from "react";
import useStaffStore from "../../store/staffStore";
import { getCookie } from "../../utils/cookie.util";
import { STAFF_TOKEN_KEY } from "../../constants/authen.constant";
import axios from "axios";


const EditEmployeeModal = ({ employee, setEmployees, closeModal }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    address: '',
    avatar: null
  });
  const { setStaff } = useStaffStore((state) => state)
  const [, setErrorMessage] = useState("");

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || '',
        avatar: employee.avatar || '',
        phone: employee.phone || '',
        dob: employee.dob || '',
        email: employee.email || '',
        address: employee.address || ''
      });
    }
  }, [employee]);

  const handleSave = async () => {
    if (!employee || !employee._id) {
      console.log("Không tìm thấy người dùng");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('email', form.email);
      formData.append('dob', form.dob);
      formData.append('address', form.address);

      if (form.avatar instanceof File) {
        formData.append('avatar', form.avatar);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_URL_BACKEND}/staff/update-staff/${employee._id}`,
        formData,
        {
          headers: {
            'staff-token': getCookie(STAFF_TOKEN_KEY),
            'Content-Type': 'multipart/form-data' 
          }
        }
      );

      window.location.reload();
      console.log("Cập nhật thành công:", response.data);
      setStaff((prevStaff) =>
        prevStaff.map((p) =>
          p._id === employee._id ? response.data.data : p
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      setErrorMessage("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, avatar: file });
    }
  };


  return (
    <div className="modal fade show d-block" id="editEmployeeModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Sửa Nhân Viên</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <label className="form-label">
              Ảnh đại diện
              <input type="file" className="form-control mb-3" onChange={handleFileChange} />
            </label>
            {form.avatar && (
              <img
                src={form.avatar}
                alt="Employee"
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%", marginBottom: "10px" }}
                className="m-3"
              />
            )}

            <label className="form-label fw-bold">Họ và tên</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Nhập họ và tên"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label className="form-label fw-bold">Email</label>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Nhập email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <label className="form-label fw-bold">Số điện thoại</label>
            <input
              type="tel"
              className="form-control mb-3"
              placeholder="Nhập số điện thoại"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <label className="form-label fw-bold">Ngày sinh</label>
            <input
              type="date"
              className="form-control mb-3"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />

            <label className="form-label fw-bold">Địa chỉ</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Nhập địa chỉ"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <button className="btn btn-primary w-100" onClick={handleSave}>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
