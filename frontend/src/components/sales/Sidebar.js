import React, { useState } from "react";
import { TOKEN_KEY } from "../../constants/authen.constant";
import { setCookie } from "../../utils/cookie.util";
import useAuthAdminStore from "../../store/authAdminStore";
import { ROLE } from "../../constants/staff.constant";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  const { permissions } = useAuthAdminStore((state) => state);

  const handleLogout = () => {
    setCookie(TOKEN_KEY, '');
    window.location.replace("/admin/login");
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="btn btn-light btn-sm mb-3" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <i className="bi bi-justify-left"></i> : <i className="bi bi-x-lg"></i>}
      </button>
      {!collapsed && (
        <div className="text-white p-3" >
          <a href="/admin/staff-info" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">Thông Tin Nhân Viên</a>
          <a href="/admin/dashboard#products" className="d-block  text-white py-2 text-decoration-none fw-bold transition-hover">Danh Sách Sản Phẩm</a>
          <div className="dropdown">
            <a
              href="#null"
              className="d-block text-white py-2 text-decoration-none fw-bold transition-hover"
              onClick={(e) => {
                e.preventDefault();
                setIsOrderDropdownOpen(!isOrderDropdownOpen);
              }}
            >
              Danh Sách Đơn Hàng <i className={`bi ${isOrderDropdownOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            </a>
            {isOrderDropdownOpen && (
              <div className="dropdown-menu show bg-dark text-white border-0">
                <a href="/admin/dashboard#pending-orders" className="d-block text-white py-2 ps-4 text-decoration-none me-2"> Đơn hàng chờ xác nhận</a>
                <a href="/admin/dashboard#confirmed-orders" className="d-block text-white py-2 ps-4 text-decoration-none me-2"> Đơn hàng đã xác nhận</a>
                <a href="/admin/dashboard#completed-orders" className="d-block text-white p-2 ps-4 text-decoration-none me-2"> Đơn hàng đã giao</a>
              </div>
            )}
          </div>
          <a href="/admin/staff-attendance-history" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">Lịch Sử Chấm Công</a>
          { permissions([ROLE.ADMIN]) && <a href="/admin/employee" className="d-block text-primary py-2 text-decoration-none fw-bold transition-hover">Quản Lý Nhân Sự</a> }
          { permissions([ROLE.ADMIN]) && <a href="/admin/resource" className="d-block text-primary py-2 text-decoration-none fw-bold transition-hover">Quản Lý Chấm Công</a> }
        </div>
      )}
       <button
        className="btn btn-danger mt-3 logout-btn"
        style={{ bottom: "50px", top: "auto", right: "90px"}}
        onClick={handleLogout}
      >
        Đăng Xuất
      </button>
    </div>
  );
};

export default Sidebar;
