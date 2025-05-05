import React, { useState, useMemo } from "react";
import { STAFF_TOKEN_KEY } from "../../constants/authen.constant";
import { setCookie } from "../../utils/cookie.util";
import useAuthAdminStore from "../../store/authAdminStore";
import useChatStore, { selectUnreadCount } from "../../store/chatStore";
import { ROLE } from "../../constants/staff.constant";
import { Link } from "react-router-dom";


const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const { permissions } = useAuthAdminStore((state) => state);
  // const customers = useChatStore((state) => state.customers);
  const unreadMessageCount = useChatStore(selectUnreadCount);


  const handleLogout = () => {
    setCookie(STAFF_TOKEN_KEY, '');
    window.location.replace("/admin/login");
  };


  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button
        className="btn btn-light btn-sm mb-3"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <i className="bi bi-justify-left"></i> : <i className="bi bi-x-lg"></i>}
      </button>

      {!collapsed && (
        <div className="text-white p-3">
          <Link to="/admin/view" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-layers me-2"></i>Thống Kê
          </Link>
          <Link to="/admin/staff-info" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-person-circle me-2"></i>Thông Tin Nhân Viên
          </Link>
          <Link to="/admin/dashboard#products" className="d-block  text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-box-seam me-2"></i>Danh Sách Sản Phẩm
          </Link>
          <div className="dropdown">
            <Link
              to="#null"
              className="d-block text-white py-2 text-decoration-none fw-bold transition-hover"
              onClick={(e) => {
                e.preventDefault();
                setIsOrderDropdownOpen(!isOrderDropdownOpen);
              }}
            >
              <i className="bi bi-clipboard-check me-2"></i>Danh Sách Đơn Hàng <i className={`bi ${isOrderDropdownOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            </Link>
            {isOrderDropdownOpen && (
              <div className="dropdown-menu show bg-dark text-white border-0">
                <a href="/admin/dashboard#pending-orders" className="d-block text-white py-2 ps-4 text-decoration-none me-2 transition-hover">Đơn hàng chờ xác nhận</a>
                <a href="/admin/dashboard#confirmed-orders" className="d-block text-white py-2 ps-4 text-decoration-none me-2 transition-hover">Đơn hàng đã xác nhận</a>
                <a href="/admin/dashboard#completed-orders" className="d-block text-white py-2 ps-4 text-decoration-none me-2 transition-hover">Đơn hàng đã giao</a>
              </div>
            )}
          </div>
          <Link
            to="/admin/chat"
            className="position-relative d-block text-white py-2 text-decoration-none fw-bold transition-hover"
          >
            <i className="bi bi-chat-fill me-2"></i>
            Tin nhắn Khách Hàng
            {unreadMessageCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unreadMessageCount}
              </span>
            )}
          </Link>

          <Link to="/admin/staff-attendance-history" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-calendar-check me-2"></i>Lịch Sử Chấm Công
          </Link>

          {permissions([ROLE.ADMIN]) && <Link to="/admin/employee" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-people me-2"></i>Quản Lý Nhân Viên
          </Link>}
          {permissions([ROLE.ADMIN]) && <Link to="/admin/resource" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-file-earmark-person me-2"></i>Quản Lý Chấm Công
          </Link>}
          {permissions([ROLE.ADMIN]) && <Link to="/admin/faceregistration" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-webcam me-2"></i>Đăng ký khuôn mặt
          </Link>}
        </div>
      )}

      {!collapsed && (
        <button
          className="btn btn-danger mt-3 logout-btn"
          style={{ top: "auto", left: "50%", transform: "translateX(-50%)" }}
          onClick={handleLogout}
        >
          Đăng Xuất
        </button>
      )}
    </div>
  );
};

export default Sidebar;
