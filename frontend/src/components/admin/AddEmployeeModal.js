import React, { useState } from "react";
import axios from "axios";
import useStaffStore from "../../store/staffStore";

const AddEmployeeModal = ({ closeModal }) => {
  const { staffList, getAllStaff } = useStaffStore();
  
  const [staff, setStaff] = useState({
    name: "",
    username: "",
    password: "",
    role_id: "",
    position: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    avatar: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [newPosition, setNewPosition] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const positions = [...new Set(staffList.map((staffItem) => staffItem.position))];

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!staff.name || !staff.username || !staff.password || !staff.position || !staff.email || !staff.phone || !staff.dob || !staff.gender || !staff.address) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const finalPosition = staff.position === "new" ? newPosition : staff.position;

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/staff/sign-up`, {
        ...staff,
        position: finalPosition,
      });

      if (response.data.status === "SUCCESS") {
        await getAllStaff();
        closeModal();
      } else {
        setErrorMessage(response.data.message || "Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      setErrorMessage("Không thể kết nối với server. Vui lòng thử lại!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStaff({ ...staff, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal fade show d-block" id="addEmployeeModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thêm Nhân Viên</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <label className="form-label">
              Ảnh đại diện
              <input type="file" className="form-control mb-3" onChange={handleFileChange} />
            </label>
            {staff.avatar && (
              <img
                src={staff.avatar}
                alt="Employee"
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%", marginBottom: "10px" }}
                className="m-3"
              />
            )}
            <input type="text" className="form-control mb-3" placeholder="Họ và tên" value={staff.name} onChange={(e) => setStaff({ ...staff, name: e.target.value })} />
            <input type="text" className="form-control mb-3" placeholder="Tên đăng nhập" value={staff.username} onChange={(e) => setStaff({ ...staff, username: e.target.value })} />

            <div className="input-group mb-3">
              <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Mật khẩu" value={staff.password} onChange={(e) => setStaff({ ...staff, password: e.target.value })} />
              <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label">Chức vụ</label>
              <select
                className="form-select"
                value={staff.position}
                onChange={(e) => setStaff({ ...staff, position: e.target.value })}
                required
              >
                <option value="">-- Chọn chức vụ --</option>
                {positions.map((position, index) => (
                  <option key={index} value={position}>
                    {position}
                  </option>
                ))}
                <option value="new">+ Thêm chức vụ mới</option>
              </select>
            </div>

            {staff.position === "new" && (
              <div className="mb-3">
                <label className="form-label">Nhập chức vụ mới</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập chức vụ mới..."
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  required
                />
              </div>
            )}

            <input type="email" className="form-control mb-3" placeholder="Email" value={staff.email} onChange={(e) => setStaff({ ...staff, email: e.target.value })} />
            <input type="tel" className="form-control mb-3" placeholder="Số điện thoại" value={staff.phone} onChange={(e) => setStaff({ ...staff, phone: e.target.value })} />
            <input type="date" className="form-control mb-3" placeholder="Ngày sinh" value={staff.dob} onChange={(e) => setStaff({ ...staff, dob: e.target.value })} />

            <div className="mb-3">
              <label className="form-label">Giới tính</label>
              <select
                className="form-select"
                value={staff.gender}
                onChange={(e) => setStaff({ ...staff, gender: e.target.value })}
                required
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <input type="text" className="form-control mb-3" placeholder="Địa chỉ" value={staff.address} onChange={(e) => setStaff({ ...staff, address: e.target.value })} />
            
            {errorMessage && (
              <div className="text-danger">
                {errorMessage}
              </div>
            )}
            
            <button className="btn btn-primary w-100" onClick={handleSave}>Thêm Nhân Viên</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
