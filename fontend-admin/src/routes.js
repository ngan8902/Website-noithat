import Dashboard from "views/Dashboard.js";
import TableList from "views/Tables.js";
import UserPage from "views/User.js";
import { Navigate } from "react-router-dom";

var routes = [
  {
    path: "/dashboard",
    name: "Trang chủ",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Danh sách sản phẩm",
    icon: "nc-icon nc-tile-56",
    component: <TableList />,
    layout: "/admin",
  },
  {
    path: "/user-page",
    name: "Thông tin người dùng",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/admin",
  },
  {
    path: "*",
    component: <Navigate to="/admin/dashboard" replace={true} />,
    layout: "/admin",
  },
];
export default routes;
