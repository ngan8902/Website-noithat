import React, { useState, useEffect } from "react";
import AddEmployeeModal from "./AddEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";
import useStaffStore from "../../store/staffStore";
import { UPLOAD_URL } from '../../constants/url.constant';

const EmployeeList = () => {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalType, setModalType] = useState(null);
  const { staffList, getAllStaff, removeStaff } = useStaffStore((state) => state);
  const [, setEmployees] = useState(null);

  const avatarDefault = '/images/guest.png';

  useEffect(() => {
    getAllStaff();
  }, [getAllStaff]);

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  const handleDelete = (_id) => {
    removeStaff(_id).then(() => {
      getAllStaff();
    });
  };

  const openAddModal = () => {
    setModalType("add");
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setModalType("edit");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedEmployee(null);
  };

  const getImageUrl = (avatar) => {
    if (!avatar) return avatarDefault;

    if (avatar.includes("lh3.googleusercontent.com")) {
      return avatar;
    }

    if (avatar.includes("drive.google.com")) {
      const match = avatar.match(/id=([a-zA-Z0-9_-]+)/);
      const idFromViewLink = avatar.match(/\/d\/(.*?)\//);
      const id = match ? match[1] : idFromViewLink ? idFromViewLink[1] : null;

      if (id) {
        return `${process.env.REACT_APP_URL_BACKEND}/image/drive-image/${id}`;
      } else {
        console.error("Không thể lấy ID từ Google Drive link:", avatar);
      }
    }

    if (avatar.startsWith("https://")) {
      return avatar;
    }

    return `${UPLOAD_URL}${avatar}` || avatarDefault;
  };

  const filteredStaffList = staffList?.filter((staff) => {
    const name = removeVietnameseTones(staff.name || "");
    const staffCode = removeVietnameseTones(staff.staffcode || "");
    const searchChars = removeVietnameseTones(search).split('');

    return searchChars.every((char) =>
      name.includes(char) || staffCode.includes(char)
    );
  }) || [];

  return (
    <div id="employees" className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Danh Sách Nhân Viên</h5>
        <button className="btn btn-primary mb-3" onClick={openAddModal}>Thêm Nhân Viên</button>
      </div>

      <div className="input-group mt-2">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm nhân viên theo ID, tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Số Điện Thoại</th>
            <th>Ngày Sinh</th>
            <th>Giới Tính</th>
            <th>Địa Chỉ</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaffList.length > 0 ? (
            filteredStaffList.map((staff) => (
              <tr key={staff._id}>
                <td>{staff.staffcode}</td>
                <td>
                  <img
                    src={getImageUrl(staff?.avatar)}
                    alt={staff.name}
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                  />
                </td>
                <td>{staff.name}</td>
                <td>{staff.email}</td>
                <td>{staff.phone}</td>
                <td>{staff.dob}</td>
                <td>{staff.gender}</td>
                <td style={{ maxWidth: "200px" }} className="text-truncate">{staff.address}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => openEditModal(staff)}>Sửa</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(staff._id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center text-muted">Không tìm thấy nhân viên nào!</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalType === "add" && <AddEmployeeModal setEmployees={setEmployees} closeModal={closeModal} />}
      {modalType === "edit" && selectedEmployee && (
        <EditEmployeeModal employee={selectedEmployee} setEmployees={setEmployees} closeModal={closeModal} />
      )}
    </div>
  );
};

export default EmployeeList;
