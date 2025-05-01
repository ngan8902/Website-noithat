import React, { useState } from "react";
import Sidebar from "../components/sales/Sidebar";
import ResourceList from "../components/admin/ResourceList";

const Resource = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`d-flex app-container ${collapsed && window.innerWidth < 576 ? "sidebar-open" : ""}`}>
        {collapsed && window.innerWidth < 576 && (
          <div className="sidebar-overlay" onClick={() => setCollapsed(false)}></div>
        )}
        <Sidebar />
        <div className="main-content">
            <h2 className="text-center fw-bold mb-4">Quản lý Chấm Công</h2>
            <ResourceList />
        </div>
    </div>
  );
};

export default Resource;
