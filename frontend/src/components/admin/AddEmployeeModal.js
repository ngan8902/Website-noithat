import React, { useState } from "react";

const AddEmployeeModal = ({ setEmployees, closeModal }) => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    username: "",
    password: "",
    position: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    avatar: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    if (!form.name || !form.username || !form.password || !form.position || !form.email || !form.phone || !form.dob || !form.gender || !form.address) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setEmployees((prev) => [
      ...prev,
      { ...form, id: prev.length ? Math.max(...prev.map((e) => e.id)) + 1 : 1 },
    ]);
    closeModal();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, avatar: reader.result });
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
            {form.avatar && (
              <img
                src={form.avatar}
                alt="Employee"
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%", marginBottom: "10px" }}
                className="m-3"
              />
            )}
            <input type="text" className="form-control mb-3" placeholder="Họ và tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="text" className="form-control mb-3" placeholder="Tên đăng nhập" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            
            <div className="input-group mb-3">
              <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Mật khẩu" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
              </button>
            </div>

            <input type="text" className="form-control mb-3" placeholder="Chức vụ" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            <input type="email" className="form-control mb-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="tel" className="form-control mb-3" placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input type="date" className="form-control mb-3" placeholder="Ngày sinh" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
            <input type="text" className="form-control mb-3" placeholder="Giới tính" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
            <input type="text" className="form-control mb-3" placeholder="Địa chỉ" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

            <button className="btn btn-primary w-100" onClick={handleSave}>Thêm Nhân Viên</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
