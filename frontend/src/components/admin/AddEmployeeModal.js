import React, { useState } from "react";
import axios from "axios";

const AddEmployeeModal = ({ setEmployees, closeModal }) => {
  const [staff, setStaff] = useState({  
    name: "",
    username: "",
    password: "",
    role_id: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    avatar: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [, setPasswordError] = useState(""); 

  const handleSave = (e) => {
    e.preventDefault();

    if (!staff.name || !staff.username || !staff.password || !staff.position || !staff.email || !staff.phone || !staff.dob || !staff.gender || !staff.address) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    console.log("Dữ liệu gửi lên API:", staff);

    axios
      .post(`${process.env.REACT_APP_URL_BACKEND}/staff/sign-up`, staff).then((response) => {
        console.log("Phản hồi từ server:", response);
        const { data } = response;

        if (data.status === 'SUCCESS') {
          window.location.reload()
        } else {
          setPasswordError(data.message || "Có lỗi xảy ra, vui lòng thử lại!");
          console.error('lỗi:', setPasswordError)
        }
      })
      .catch((err) => {
        console.error("Lỗi đăng ký:", err);
        setPasswordError("Không thể kết nối với server. Vui lòng thử lại!");
      });
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

            <input type="text" className="form-control mb-3" placeholder="Chức vụ" value={staff.position} onChange={(e) => setStaff({ ...staff, position: e.target.value })} />
            <input type="email" className="form-control mb-3" placeholder="Email" value={staff.email} onChange={(e) => setStaff({ ...staff, email: e.target.value })} />
            <input type="tel" className="form-control mb-3" placeholder="Số điện thoại" value={staff.phone} onChange={(e) => setStaff({ ...staff, phone: e.target.value })} />
            <input type="date" className="form-control mb-3" placeholder="Ngày sinh" value={staff.dob} onChange={(e) => setStaff({ ...staff, dob: e.target.value })} />
            <input type="text" className="form-control mb-3" placeholder="Giới tính" value={staff.gender} onChange={(e) => setStaff({ ...staff, gender: e.target.value })} />
            <input type="text" className="form-control mb-3" placeholder="Địa chỉ" value={staff.address} onChange={(e) => setStaff({ ...staff, address: e.target.value })} />
            <button className="btn btn-primary w-100" onClick={handleSave}>Thêm Nhân Viên</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
