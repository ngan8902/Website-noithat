import React, {useEffect, useState} from "react";
import Sidebar from "../components/sales/Sidebar";
import ProductList from "../components/sales/ProductList";
import OrderList from "../components/sales/OrderList";
import ConfirmOrderList from "../components/sales/ConfirmOrderList";
import CompleteOrderList from "../components/sales/CompleteOrderList";
import useOrderStore from "../store/orderStore";
import SearchBar from "../components/sales/searchBar";
import axios from "axios";

const SalesManagement = () => {
  const { fetchOrders, updateOrderStatus } = useOrderStore();

   useEffect(() => {
        fetchOrders();
    
        const interval = setInterval(() => {
          fetchOrders();
        }, 5000); 
    
        return () => clearInterval(interval);
      }, [fetchOrders]);

  const handleConfirmOrder = (orderId) => {
    updateOrderStatus(orderId, "processing");
  };

  const handleShipOrder = async (orderId, orderCode) => {
    try {
      const guestOrderCodes = JSON.parse(localStorage.getItem("guestOrderCodes")) || [];
      const isGuestOrder = guestOrderCodes.includes(orderCode);

      if (isGuestOrder) {
        // Nếu là đơn của khách (orderCode nằm trong localStorage)
        console.log("Đơn hàng khách, chỉ cập nhật frontend.");
        await updateOrderStatus(orderId, "shipped");
      } else {
        // Nếu là đơn bình thường, gửi API cập nhật backend
        console.log("Đơn hàng nội bộ, gửi API cập nhật backend.");
        await axios.put(`${process.env.REACT_APP_URL_BACKEND}/send/ship/${orderId}`);
        await updateOrderStatus(orderId, "shipped");
      }

      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi giao hàng:", error);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    await updateOrderStatus(orderId, "delivered");
    fetchOrders();
  };

  const handleReturnOrder = async (orderId) => {
    await updateOrderStatus(orderId, "return");
    fetchOrders();
  };

  const handleCancelOrder = (orderId) => {
    updateOrderStatus(orderId, "cancelled");
  };

  const onConfirmCancel = async (orderId, orderCode) => {
    console.log("Xác nhận hủy đơn hàng:", orderId, orderCode);
    await updateOrderStatus(orderId, "cancelled_confirmed");

    const guestOrderCodes = JSON.parse(localStorage.getItem("guestOrderCodes")) || [];

    const updatedGuestOrderCodes = guestOrderCodes.filter(code => code !== orderCode);

    localStorage.setItem("guestOrderCodes", JSON.stringify(updatedGuestOrderCodes));

    console.log(`Đã xóa ${orderCode} khỏi guestOrderCodes`);
  };

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`d-flex app-container ${collapsed && window.innerWidth < 768 ? "sidebar-open" : ""}`}>
      {collapsed && window.innerWidth < 768 && (
        <div className="sidebar-overlay" onClick={() => setCollapsed(false)}></div>
      )}
      <Sidebar />
      <div className="main-content">
        <h2 className="text-center fw-bold mb-4">Quản Lý Bán Hàng</h2>
        <ProductList />
        <SearchBar />
        <OrderList onConfirm={handleConfirmOrder} onCancel={handleCancelOrder} />
        <ConfirmOrderList onShip={handleShipOrder} onCancel={handleCancelOrder} />
        <CompleteOrderList onComplete={handleCompleteOrder} onReturn={handleReturnOrder} onConfirmCancel={onConfirmCancel} />
      </div>
    </div>
  );
};

export default SalesManagement;
