import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AccountInfo from "../components/account/AccountInfo";
import OrderHistory from "../components/account/OrderHistory";
import OrderStatus from "../components/account/OrderStatus";
import { getCookie } from "../utils/cookie.util";
import { TOKEN_KEY } from '../constants/authen.constant';

const Account = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie(TOKEN_KEY);

    axios
      .get(`${process.env.REACT_APP_URL_BACKEND}/user/getme`, {
        headers: { token: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Lấy thông tin người dùng thành công:", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        alert("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
        localStorage.removeItem("user");
        navigate("/home");
      });
  }, [navigate]);

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
          {user ? (
            <AccountInfo user={user} setUser={setUser} />
          ) : (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
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
