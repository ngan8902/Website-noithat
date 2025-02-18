import React, { useState } from "react";
import Sidebar from "../components/sales/Sidebar";
import ProductList from "../components/sales/ProductList";
import OrderList from "../components/sales/OrderList";

const SalesManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Sofa Sang Trọng", price: 10000000, quantity: 50 },
    { id: 2, name: "Bàn Ăn Hiện Đại", price: 8500000, quantity: 30 },
    { id: 3, name: "Ghế Thư Giãn", price: 7200000, quantity: 20 },
  ]);

  const [orders, setOrders] = useState([
    { id: 1, customer: "A B C", phone: "0123456789", address: "Long An", product: "Sofa Sang Trọng", total: 10500000, payment: "Thanh toán khi nhận hàng", status: "Đang xử lý" },
  ]);

  return (
    <div className="d-flex app-container">
      <Sidebar />
      <div className="content p-4 main-content">
        <h2 className="text-center fw-bold mb-4">Quản Lý Bán Hàng</h2>
        <ProductList products={products} setProducts={setProducts} />
        <OrderList orders={orders} setOrders={setOrders} />
      </div>
    </div>
  );
};

export default SalesManagement;
