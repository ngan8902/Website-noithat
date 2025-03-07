import React, { useState, useEffect } from "react";
import AddEmployeeModal from "./AddEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";
import useStaffStore from "../../store/staffStore"

const EmployeeList = () => {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalType, setModalType] = useState(null);
  const {staffList, getAllStaff, removeStaff} = useStaffStore((state) => state);
  const [,setEmployees] = useState(null)
 
  useEffect (() => {
    getAllStaff()
  },[getAllStaff]) 
  
  const handleDelete = (_id) => {
    removeStaff(_id).then(() => {
      getAllStaff();
    })
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
            <th>Chức Vụ</th>
            <th>Email</th>
            <th>Số Điện Thoại</th>
            <th>Ngày Sinh</th>
            <th>Giới Tính</th>
            <th>Địa Chỉ</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {staffList && staffList.length > 0 ? (
            staffList.filter(staff => 
              staff.name.toLowerCase().includes(search.toLowerCase()) || 
              staff.staffcode.toLowerCase().includes(search.toLowerCase())
            ).map((staff) => (
              <tr key={staff._id}>
                <td>{staff.staffcode}</td>
                <td>
                  <img
                    src={staff.avatar || "https://via.placeholder.com/100"}
                    alt={staff.name}
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                  />
                </td>
                <td>{staff.name}</td>
                <td>{staff.position}</td>
                <td>{staff.email}</td>
                <td>{staff.phone}</td>
                <td>{staff.dob}</td>
                <td>{staff.gender}</td>
                <td style={{ maxWidth: "200px" }} className="text-truncate">{staff.address}</td>
                <td>
                  <button className="btn btn-warning btn-sm" onClick={() => openEditModal(staff)}>Sửa</button>
                  <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(staff._id)}>Xóa</button>
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
