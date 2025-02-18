import React, { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="btn btn-light btn-sm mb-3" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "☰" : "X"}
      </button>
      {!collapsed && (
        <div className="text-white p-3" >
          <a href="#products" className="d-block text-white py-2">Danh Sách Sản Phẩm</a>
          <a href="#orders" className="d-block text-white py-2">Danh Sách Đơn Hàng</a>
        </div>
      )}
    </div>
  );
};

export default Sidebar;