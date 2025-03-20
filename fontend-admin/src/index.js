import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import storeRedux from "./store";


import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "layouts/Admin.js";
import Login from "views/Login";
import Signup from "views/Signup";
import axiosClient from "./utils/fetch.utils";
import Ao from "views/Listproduct/Product-Ao";
import Quan from "views/Listproduct/Product-Quan";
import Vay from "views/Listproduct/Product-Vay";
import FaceDetect from "views/Face-detect";

const root = ReactDOM.createRoot(document.getElementById("root"));
// const longinPage = () => {
//   return root.render(
//     <BrowserRouter>
//       <Routes>
//         <Route path="/admin/login" element={<Login />} />
//         <Route path="/admin/*" element={<Navigate to="/admin/login" />} />
//         <Route path="/admin/login/signup" element={<Signup />} />
//         <Route path="/admin/*" element={<Navigate to="/admin/login/signup" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// lay token trong localStore -> gui xuong server thong qua api -> check token nay cho phep dang nhan khong 
// -> token hop le: set authen bang true
// -> token ko hop le: xoa token khoi localStore va authen la false
let authen = false;
// const token = window.localStorage.getItem('tokenshop')
// if (token) {
//   axiosClient.defaults.headers.common['authorization-shop'] = token
//   axiosClient.get('/api/shop/authen').then((response) => {
//     if (response && response.data && response.data.data) {
//       const shopData = response.data.data;
//       const userName = response.data.data;
//       const address = response.data.data;
//       storeRedux.dispatch({
//         type: 'shopData',
//         shopData: shopData
//       })
//       storeRedux.dispatch({
//         type: 'userName',
//         userName: userName
//       })
//       storeRedux.dispatch({
//         type: 'address',
//         address: address
//       })
//       root.render(
//         <BrowserRouter>
//           <Routes>
//             <Route path="/admin/*" element={<AdminLayout />} />
//             <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
//             <Route path="/admin/danhmucsanpham/Ao" element={<Ao />} />
//             <Route path="/admin/*" element={<Navigate to="/admin/danhmucsanpham/Ao" />} />
//             <Route path="/admin/danhmucsanpham/Quan" element={<Quan />} />
//             <Route path="/admin/*" element={<Navigate to="/admin/danhmucsanpham/Quan" />} />
//             <Route path="/admin/danhmucsanpham/Vay" element={<Vay />} />
//             <Route path="/admin/*" element={<Navigate to="/admin/danhmucsanpham/Vay" />} />
//           </Routes>
//         </BrowserRouter>
//       );
//     } else {
//       longinPage()
//     }
//   })
// } else {
//   longinPage()02

// }
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/danhmucsanpham/Ao" element={<Ao />} />
      <Route path="/admin/*" element={<Navigate to="/admin/danhmucsanpham/Ao" />} />
      <Route path="/admin/danhmucsanpham/Quan" element={<Quan />} />
      <Route path="/admin/*" element={<Navigate to="/admin/danhmucsanpham/Quan" />} />
      <Route path="/admin/danhmucsanpham/Vay" element={<Vay />} />
      <Route path="/admin/*" element={<Navigate to="/admin/danhmucsanpham/Vay" />} />
      <Route path="/system/face-detect/*" element={<FaceDetect />}  />
    </Routes>
  </BrowserRouter>
);