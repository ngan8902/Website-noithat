import React, {useEffect} from "react";
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

  const handleShipOrder = async (orderId) => {
    try {
      // Gửi request API để cập nhật trạng thái đơn hàng
      await axios.put(`${process.env.REACT_APP_URL_BACKEND}/send/ship/${orderId}`);
      // Cập nhật trạng thái trên frontend sau khi API thành công
      updateOrderStatus(orderId, "shipped");
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

  const onConfirmCancel = async (orderId) => {
    await updateOrderStatus(orderId, "cancelled_confirmed");
  };

  return (
    <div className="d-flex app-container">
      <Sidebar />
      <div className="content p-4 main-content">
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
