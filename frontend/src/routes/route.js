import React from "react";
import Home from "../pages/Home";
import AboutDetail from "../pages/AboutDetail";
import Contact from "../pages/Contact";
import ProductDetail from "../pages/ProductDetail";
import PolicyTerms from "../pages/PolicyTerms";
import Checkout from "../pages/Checkout";
import Cart from "../pages/Cart";
import NotFound from "../pages/NotFound";
import Account from "../pages/Account";
import SalesManagement from "../pages/SalesManagement";
import LoginAdmin from "../pages/LoginAdmin";
import StaffInfo from "../pages/StaffInfo";
import StaffAttendanceHistory from "../pages/StaffAttendanceHistory";
import Employee from "../pages/Employee";
import Resource from "../pages/Resource";
import ProductType from "../pages/ProductType";
import Chat from "../pages/Chat";
import SearchResults from "../pages/SearchResults";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/DashBoard";
import FaceDetect from "../pages/Face-detect";
import FaceRegistrationPage from "../pages/FaceRegistrationPage";
import GuestOrderStatus from "../pages/GuestOrderStatus";

export const publicRoute = [
  { path: "/", element: <Home />, isShow: true },
  { path: "/home", element: <Home />, isShow: true },
  { path: "/about", element: <AboutDetail />, isShow: true },
  { path: "/contact", element: <Contact />, isShow: true },
  { path: "/:name/:id", element: <ProductDetail />, isShow: true },
  { path: "/policy-terms", element: <PolicyTerms />, isShow: true },
  { path: "/checkout", element: <Checkout />, isShow: true },
  { path: "/cart", element: <Cart />, isShow: true },
  { path: "*", element: <NotFound /> },
  { path: "/account", element: <Account />, isShow: true },
  { path: "/product-type/:id", element: <ProductType />, isShow: true },
  { path: "/search", element: <SearchResults />, isShow: true},
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/guest-order", element: <GuestOrderStatus />, isShow: true },
]

export const privateRoute = [
  { path: "/admin/login", element: <LoginAdmin />, isShow: false, layout: React.Fragment },
  { path: "/admin/dashboard", element: <SalesManagement />, isShow: false },
  { path: "/admin/view", element: <Dashboard />, isShow: false },
  { path: "/admin/staff-info", element: <StaffInfo />, isShow: false },
  { path: "/admin/staff-attendance-history", element: <StaffAttendanceHistory />, isShow: false },
  { path: "/admin/employee", element: <Employee />, isShow: false },
  { path: "/admin/resource", element: <Resource />, isShow: false },
  { path: "/admin/chat", element: <Chat />, isShow: false},
  { path: "/admin/face-detect", element: <FaceDetect />, isShow: false, layout: React.Fragment},
  { path: "/admin/faceregistration", element: <FaceRegistrationPage />, isShow: false},
]

export const route = [
  ...publicRoute,
  ...privateRoute
];
