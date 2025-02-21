import React, { useState } from "react";
import Sidebar from "../components/sales/Sidebar";
import ManagerInfo from "../components/sales/ManagerInfo";
import ProductList from "../components/sales/ProductList";
import OrderList from "../components/sales/OrderList";
import AttendanceHistory from "../components/sales/AttendanceHistory";

const SalesManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, image: "/assets/sofa/sofa-1.jpg", name: "Sofa Sang Trọng", price: 10000000, quantity: 50 },
    { id: 2, image: "/assets/ban-an/ban-an-1.jpg", name: "Bàn Ăn Hiện Đại", price: 8500000, quantity: 30 },
    { id: 3, image: "/assets/ghe-thu-gian/ghe-thu-gian-1.jpg", name: "Ghế Thư Giãn", price: 7200000, quantity: 20 },
  ]);

  const [orders, setOrders] = useState([
    { id: 1, customer: "A B C", phone: "0123456789", address: "Long An", product: "Sofa Sang Trọng", total: 10500000, payment: "Thanh toán khi nhận hàng", status: "Đang xử lý" },
  ]);

  const records = [
    { id: 1, employee: "A B C", date: "01/02/2025", checkIn: "08:00", checkOut: "17:00", totalHours: "9h", status: "Đúng giờ" },
    { id: 1, employee: "A B C", date: "02/02/2025", checkIn: "08:10", checkOut: "17:10", totalHours: "9h'", status: "Muộn" },
  ];

  const manager = {
    avatar: "/images/banner.png",
    id: 1,
    name: "Tạ Duy Công Chiến",
    dob: "10/10/1985",
    email: "manager@example.com",
    phone: "0123456789",
  };

  return (
    <div className="d-flex app-container">
      <Sidebar />
      <div className="content p-4 main-content">
        <h2 className="text-center fw-bold mb-4">Quản Lý Bán Hàng</h2>
        <ManagerInfo manager={manager} />
        <ProductList products={products} setProducts={setProducts} />
        <OrderList orders={orders} setOrders={setOrders} />
        <AttendanceHistory records={records} />
      </div>
    </div>
  );
};

export default SalesManagement;
