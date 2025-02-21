import React, { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="btn btn-light btn-sm mb-3" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <i className="bi bi-card-list"></i> : <i className="bi bi-x-lg"></i>}
      </button>
      {!collapsed && (
        <div className="text-white p-3" >
          <a href="#info" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">Thông Tin Nhân Viên</a>
          <a href="#products" className="d-block  text-white py-2 text-decoration-none fw-bold transition-hover">Danh Sách Sản Phẩm</a>
          <a href="#orders" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">Danh Sách Đơn Hàng</a>
          <a href="#users" className="d-block text-white py-2 text-decoration-none fw-bold transition-hover">Lịch Sử Chấm Công</a>
        </div>
      )}
    </div>
  );
};

export default Sidebar;