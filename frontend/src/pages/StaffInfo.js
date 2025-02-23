import React from "react";
import Sidebar from "../components/sales/Sidebar";
import ManagerInfo from "../components/sales/ManagerInfo";
import useAuthAdminStore from "../store/authAdminStore";

const StaffInfo = () => {
  const { user } = useAuthAdminStore((state) => state);


  return (
    <div className="d-flex app-container">
      <Sidebar />
      <div className="content p-4 main-content">
        <ManagerInfo user={user} />
      </div>
    </div>
  );
};

export default StaffInfo;
