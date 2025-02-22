import React, { useState } from "react";
import AddEmployeeModal from "./AddEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";

const EmployeeList = ({ employees, setEmployees }) => {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalType, setModalType] = useState(null);

  const handleDelete = (id) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
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

  const filteredEmployees = employees.filter((e) =>
    e.id.toString().includes(search) ||
    e.name.toLowerCase().includes(search.toLowerCase())
  );

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
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
            {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>
                    <img 
                        src={employee.avatar || "https://via.placeholder.com/100"} 
                        alt={employee.name} 
                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                    />
                    </td>
                    <td>{employee.name}</td>
                    <td>{employee.position}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.dob}</td>
                    <td>
                    <button className="btn btn-warning btn-sm" onClick={() => openEditModal(employee)}>Sửa</button>
                    <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(employee.id)}>Xóa</button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="8" className="text-center text-muted">Không tìm thấy nhân viên nào!</td>
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
