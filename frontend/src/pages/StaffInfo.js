import React from "react";
import Sidebar from "../components/sales/Sidebar";
import ManagerInfo from "../components/sales/ManagerInfo";
import useAuthAdminStore from "../store/authAdminStore";

const StaffInfo = () => {
  const { staff } = useAuthAdminStore((state) => state);

  return (
    <div className="d-flex app-container">
      <Sidebar />
      <div className="content p-4 main-content">
        <h2 className="text-center fw-bold mb-4">Thông Tin Nhân Viên</h2>
        <ManagerInfo staff={staff} />
      </div>
    </div>
  );
};

export default StaffInfo;
