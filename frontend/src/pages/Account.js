import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import AccountInfo from "../components/account/AccountInfo";
import OrderHistory from "../components/account/OrderHistory";
import OrderStatus from "../components/account/OrderStatus";
import useOrderStore from "../store/orderStore";
import OrderCancelled from "../components/account/OrderCancelled";
import axios from "axios";
import { TOKEN_KEY } from "../constants/authen.constant";

const Account = () => {
  const { createOrder, getOrderByUser, orders, setOrders } = useOrderStore();
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
    getOrderByUser();
  
      const interval = setInterval(() => {
        getOrderByUser();
      }, 5000); 
  
      return () => clearInterval(interval);
    }, [getOrderByUser]);

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

  useEffect(() => {
    const checkStatuses = async () => {
      const paymentLinkId = localStorage.getItem("paymentLinkId");
      console.log("paymentLinkId", paymentLinkId);
      const orderId = localStorage.getItem("orderId");
      console.log("orderId", orderId);

      if (paymentLinkId) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_URL_BACKEND}/payos/check-status/${paymentLinkId}`
          );

          const data = res.data;
          console.log("Trạng thái thanh toán PayOS:", data);
          if (data.message.includes("Thanh toán thành công")) {
            console.log("Dữ liệu đơn hàng PayOS:", data.orderData);
            const orderData = data.orderData;
            const headers = user?.token ? { Authorization: TOKEN_KEY } : {};
            await createOrder(orderData, { headers });
          }

          localStorage.removeItem("paymentLinkId");
          fetchOrders();
        } catch (err) {
          console.error("Lỗi khi kiểm tra trạng thái thanh toán PayOS:", err);
        }
      }

      if (orderId) {
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_URL_BACKEND}/momo/payment-status/${orderId}`
          );

          const data = res.data;
          console.log("Trạng thái thanh toán MoMo:", data);
          if (data.message.includes("Transaction success")) {
            console.log("Dữ liệu đơn hàng MoMo:", data.orderData);
            const orderData = data.orderData;
            const headers = user?.token ? { Authorization: TOKEN_KEY } : {};
            await createOrder(orderData, { headers });
          }

          localStorage.removeItem("orderId");
          fetchOrders();
        } catch (err) {
          console.error("Lỗi khi kiểm tra trạng thái thanh toán MoMo:", err);
        }
      }
     };

    checkStatuses();
  }, []);

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
              <p className="text-danger fw-bold">Không tìm thấy thông tin người dùng. Vui lòng Đăng Nhập hoặc Đăng Ký tài khoản!</p>
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
