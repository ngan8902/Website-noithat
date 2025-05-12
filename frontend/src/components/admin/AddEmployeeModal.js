import React, { useState } from "react";
import axios from "axios";
import useStaffStore from "../../store/staffStore";

const AddEmployeeModal = ({ closeModal }) => {
  const { getAllStaff } = useStaffStore();

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
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { name, username, password, role_id, email, phone, dob, gender, address, avatar } = staff;

    if (!name || !username || !password || !email || !phone || !dob || !gender || !address) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("role_id", role_id);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("address", address);

    // Nếu avatar là file thì append file, nếu chỉ là base64 thì convert lại
    if (avatar instanceof File) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL_BACKEND}/staff/sign-up`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
      setStaff({ ...staff, avatar: file });
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
                src={URL.createObjectURL(staff.avatar)}
                alt="Product"
                style={{ width: "100px", height: "100px", objectFit: "cover", marginBottom: "10px" }}
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

            <button className="btn btn-primary w-100" onClick={handleSave} disabled={loading}>
              {loading ? "Đang xử lý..." : "Thêm Nhân Viên"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
