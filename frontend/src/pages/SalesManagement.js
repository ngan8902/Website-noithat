import React, { useState } from "react";
import Sidebar from "../components/sales/Sidebar";
import ManagerInfo from "../components/sales/ManagerInfo";
import ProductList from "../components/sales/ProductList";
import OrderList from "../components/sales/OrderList";
import ConfirmOrderList from "../components/sales/ConfirmOrderList";
import CompleteOrderList from "../components/sales/CompleteOrderList";
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

  const [confirmOrders, setConfirmOrders] = useState([]);
  const [completeOrders, setCompleteOrders] = useState([]);

  // Xác nhận đơn hàng -> chuyển từ `orders` sang `confirmOrders`
  const handleConfirmOrder = (orderId) => {
    const orderToConfirm = orders.find(order => order.id === orderId);
    if (orderToConfirm) {
      setOrders(orders.filter(order => order.id !== orderId));
      setConfirmOrders([...confirmOrders, { ...orderToConfirm, status: "Đã xác nhận" }]);
    }
  };

  // Giao hàng -> chuyển từ `confirmOrders` sang `completeOrders`
  const handleShipOrder = (orderId) => {
    const orderToShip = confirmOrders.find(order => order.id === orderId);
    if (orderToShip) {
      setConfirmOrders(confirmOrders.filter(order => order.id !== orderId));
      setCompleteOrders([...completeOrders, { ...orderToShip, status: "Đã giao hàng" }]);
    }
  };

  // Hoàn thành hoặc trả hàng
  const handleCompleteOrder = (orderId, isReturned = false) => {
    setCompleteOrders(completeOrders.map(order =>
      order.id === orderId
        ? { ...order, status: isReturned ? "Đã trả hàng" : "Đã hoàn thành" }
        : order
    ));
  };

  const handleCancelOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const handleCancelOrderConfirm = (orderId) => {
    setConfirmOrders(confirmOrders.filter(order => order.id !== orderId));
  };

  const records = [
    { id: 1, employee: "A B C", date: "01/02/2025", checkIn: "08:00", checkOut: "17:00", totalHours: "9h", status: "Đúng giờ" },
    { id: 1, employee: "A B C", date: "02/02/2025", checkIn: "08:10", checkOut: "17:10", totalHours: "9h", status: "Muộn" },
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
        <OrderList orders={orders} onConfirm={handleConfirmOrder} onCancel={handleCancelOrder} />
        <ConfirmOrderList orders={confirmOrders} onShip={handleShipOrder} onCancel={handleCancelOrderConfirm} />
        <CompleteOrderList orders={completeOrders} onComplete={handleCompleteOrder} />
        <AttendanceHistory records={records} />
      </div>
    </div>
  );
};

export default SalesManagement;
