import React, { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="btn btn-light btn-sm mb-3" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <i className="bi bi-card-list"></i> : <i className="bi bi-x-lg"></i>}
      </button>
      {!collapsed && (
        <div className="text-white p-3">
          <a href="#info" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            Thông Tin Nhân Viên
          </a>
          <a href="#products" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            Danh Sách Sản Phẩm
          </a>

          <div className="dropdown">
            <a
              href="#null"
              className="d-block text-white py-2 text-decoration-none fw-bold transition-hover"
              onClick={(e) => {
                e.preventDefault(); // Ngăn chặn điều hướng mặc định
                setIsOrderDropdownOpen(!isOrderDropdownOpen);
              }}
            >
              Danh Sách Đơn Hàng <i className={`bi ${isOrderDropdownOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            </a>
            {isOrderDropdownOpen && (
              <div className="dropdown-menu show bg-dark text-white border-0">
                <a href="#pending-orders" className="d-block text-white py-2 ps-4 text-decoration-none me-2"> Đơn hàng chờ xác nhận</a>
                <a href="#confirmed-orders" className="d-block text-white py-2 ps-4 text-decoration-none me-2"> Đơn hàng đã xác nhận</a>
                <a href="#completed-orders" className="d-block text-white p-2 ps-4 text-decoration-none me-2"> Đơn hàng đã giao</a>
              </div>
            )}
          </div>

          <a href="#users" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            Lịch Sử Chấm Công
          </a>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
