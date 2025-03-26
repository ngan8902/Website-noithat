import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import AccountInfo from "../components/account/AccountInfo";
import OrderHistory from "../components/account/OrderHistory";
import OrderStatus from "../components/account/OrderStatus";
import useOrderStore from "../store/orderStore";
import OrderCancelled from "../components/account/OrderCancelled";

const Account = () => {
  const { getOrderByUser, orders, setOrders } = useOrderStore();
  const { user, auth } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([])

  const fetchOrders = useCallback(() => {
    if (user?._id) {
      getOrderByUser(user._id);
    }
  }, [user, getOrderByUser]);

  useEffect(() => {
    if (user?._id) {
      getOrderByUser(user._id);
    }
  }, [user, getOrderByUser]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await auth();
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        localStorage.removeItem("user");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [auth, navigate]);


  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : user ? (
            <AccountInfo />
          ) : (
            <div className="text-center">
              <p className="text-danger">Không tìm thấy thông tin người dùng.</p>
            </div>
          )}
          <div className="col-md-8">
            <OrderStatus
              orders={orders}
              setOrders={fetchOrders}
              setOrder={setOrders}
              orderHistory={orderHistory}
              setOrderHistory={setOrderHistory}
            />
            <OrderHistory
              orders={orders}
              setOrders={setOrders} />
            <OrderCancelled
              orders={orders}
              setOrders={setOrders} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
