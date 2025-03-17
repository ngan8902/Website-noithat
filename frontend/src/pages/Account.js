import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import AccountInfo from "../components/account/AccountInfo";
import OrderHistory from "../components/account/OrderHistory";
import OrderStatus from "../components/account/OrderStatus";
import useOrderStore from "../store/orderStore";

const Account = () => {
  const { getOrderByUser, updateOrderStatus, orders } = useOrderStore();
  const { user, auth } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await auth();
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        alert("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
        localStorage.removeItem("user");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [auth, navigate]);

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


  const [orderHistory, setOrderHistory] = useState([]);

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
              orderHistory={orderHistory}
              setOrderHistory={setOrderHistory}
            />
            <OrderHistory orders={orderHistory} setOrders={setOrderHistory} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
