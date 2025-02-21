import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import AccountInfo from "../components/account/AccountInfo";
import OrderHistory from "../components/account/OrderHistory";
import OrderStatus from "../components/account/OrderStatus";

const Account = () => {
  const { user, auth } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await auth(); // Gọi hàm lấy thông tin người dùng từ store
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

  const [orders, setOrders] = useState([
    { id: "12345", productName: "Sofa Sang Trọng", orderDate: "01/01/2025", deliveryDate: "05/01/2025", totalPrice: "10,500,000", paymentMethod: "Thanh toán khi nhận hàng", status: "Đang Xác Nhận", quantity: 1 },
    { id: "12346", productName: "Sofa Hiện Đại", orderDate: "02/01/2025", deliveryDate: "06/01/2025", totalPrice: "8,500,000", paymentMethod: "VnPay", status: "Đã Giao Cho Đơn Vị Vận Chuyển", quantity: 1 },
    { id: "12347", productName: "Sofa Thư Giãn", orderDate: "03/01/2025", deliveryDate: "07/01/2025", totalPrice: "7,200,000", paymentMethod: "VnPay", status: "Giao hàng thành công", quantity: 1 },
  ]);

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
              setOrders={setOrders} 
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
