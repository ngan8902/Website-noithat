import React, {useEffect} from "react";
import Sidebar from "../components/sales/Sidebar";
import ProductList from "../components/sales/ProductList";
import OrderList from "../components/sales/OrderList";
import ConfirmOrderList from "../components/sales/ConfirmOrderList";
import CompleteOrderList from "../components/sales/CompleteOrderList";
import useOrderStore from "../store/orderStore";
import SearchBar from "../components/sales/searchBar";

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

  const handleShipOrder = (orderId) => {
    updateOrderStatus(orderId, "shipped");

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
