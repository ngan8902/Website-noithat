import React, { useState, useMemo } from "react";
import { STAFF_TOKEN_KEY } from "../../constants/authen.constant";
import { setCookie } from "../../utils/cookie.util";
import useAuthAdminStore from "../../store/authAdminStore";
import useChatStore from "../../store/chatStore";
import { ROLE } from "../../constants/staff.constant";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const { permissions } = useAuthAdminStore((state) => state);
  const customers = useChatStore((state) => state.customers);

  const handleLogout = () => {
    setCookie(STAFF_TOKEN_KEY, '');
    window.location.replace("/admin/login");
  };

  const unreadMessageCount = useMemo(() => {
    if (!customers || !Array.isArray(customers)) {
      return 0;
    }
    return customers.filter((customer) => customer.isRead === false).length;
  }, [customers]);


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
          <a href="/admin/view" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-layers me-2"></i>Thống Kê
          </a>
          <a href="/admin/staff-info" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-person-circle me-2"></i>Thông Tin Nhân Viên
          </a>
          <a href="/admin/dashboard#products" className="d-block  text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-box-seam me-2"></i>Danh Sách Sản Phẩm
          </a>
          <div className="dropdown">
            <a
              href="#null"
              className="d-block text-white py-2 text-decoration-none fw-bold transition-hover"
              onClick={(e) => {
                e.preventDefault();
                setIsOrderDropdownOpen(!isOrderDropdownOpen);
              }}
            >
              <i className="bi bi-clipboard-check me-2"></i>Danh Sách Đơn Hàng <i className={`bi ${isOrderDropdownOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            </a>
            {isOrderDropdownOpen && (
              <div className="dropdown-menu show bg-dark text-white border-0">
                <a href="/admin/dashboard#pending-orders" className="d-block text-white py-2 ps-4 text-decoration-none me-2 transition-hover">Đơn hàng chờ xác nhận</a>
                <a href="/admin/dashboard#confirmed-orders" className="d-block text-white py-2 ps-4 text-decoration-none me-2 transition-hover">Đơn hàng đã xác nhận</a>
                <a href="/admin/dashboard#completed-orders" className="d-block text-white py-2 ps-4 text-decoration-none me-2 transition-hover">Đơn hàng đã giao</a>
              </div>
            )}
          </div>

          {!collapsed && (
            <a href="/admin/chat" className="position-relative d-block text-white py-2 text-decoration-none fw-bold transition-hover">
              <i className="bi bi-chat-fill me-2"></i>
              Tin nhắn Khách Hàng
              {unreadMessageCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadMessageCount}
                </span>
              )}
            </a>
          )}

          <a href="/admin/staff-attendance-history" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-calendar-check me-2"></i>Lịch Sử Chấm Công
          </a>

          {permissions([ROLE.ADMIN]) && <a href="/admin/employee" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-people me-2"></i>Quản Lý Nhân Viên
          </a>}
          {permissions([ROLE.ADMIN]) && <a href="/admin/resource" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-file-earmark-person me-2"></i>Quản Lý Chấm Công
          </a>}
          {permissions([ROLE.ADMIN]) && <a href="/admin/faceregistration" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">
            <i className="bi bi-webcam me-2"></i>Đăng ký khuôn mặt 
          </a>}
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
