import { useEffect, useState } from 'react';
import axios from 'axios';
import useOrderStore from "../store/orderStore";
import OrderDetailModal from '../components/account/OrderModal';
import { UPLOAD_URL } from '../constants/url.constant';

const GuestOrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { createOrder, updateOrderStatus } = useOrderStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const paymentLinkId = localStorage.getItem("paymentLinkId");
        if (paymentLinkId) {
          console.log("paymentLinkId", paymentLinkId);

          const res = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/payos/check-status/${paymentLinkId}`);
          const data = res.data;
          console.log("Trạng thái thanh toán PayOS:", data);

          if (data.message.includes("Thanh toán thành công")) {
            console.log("Dữ liệu đơn hàng PayOS:", data.orderData);

            const orderData = data.orderData;
            await createOrder(orderData);

            // Cập nhật guestOrderCodes
            const codes = JSON.parse(localStorage.getItem("guestOrderCodes")) || [];
            const updatedCodes = [...codes, orderData.orderCode];
            localStorage.setItem("guestOrderCodes", JSON.stringify(updatedCodes));

            localStorage.removeItem("paymentLinkId");
          }
        }

        const codes = JSON.parse(localStorage.getItem("guestOrderCodes")) || [];
        if (codes.length === 0) {
          setLoading(false);
          return;
        }

        const results = await Promise.all(
          codes.map(code =>
            axios.get(`${process.env.REACT_APP_URL_BACKEND}/order/guest/${code}`)
              .then(res => res.data.data)
              .catch(err => {
                console.error(`Không tìm thấy đơn hàng với mã ${code}:`, err);
                return null;
              })
          )
        );

        const validOrders = results.filter(order => order !== null);
        setOrders(validOrders);
      } catch (err) {
        console.error("Lỗi khi xử lý đơn hàng guest:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [createOrder]);


  const handleUpdateOrder = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  if (loading) return <div className="text-center mt-4">Đang tải đơn hàng...</div>;
  if (!orders) return <div className="text-center mt-4">Không tìm thấy đơn hàng.</div>;

  const handleDeleteOrder = (orderCode) => {
    // Xóa trong localStorage
    const codes = JSON.parse(localStorage.getItem("guestOrderCodes")) || [];
    const updatedCodes = codes.filter(code => code !== orderCode);
    localStorage.setItem("guestOrderCodes", JSON.stringify(updatedCodes));

    // Xóa trong state
    setOrders(prev => prev.filter(order => order.orderCode !== orderCode));
  };

  const statusLabels = {
    pending: "Chờ xác nhận",
    processing: "Đang xử lý",
    shipped: "Đang giao hàng",
    delivered: "Đã nhận hàng",
    return_requested: "Đang yêu cầu trả hàng",
    return: "Đã trả hàng",
    cancelled: "Đang chờ hủy",
    cancelled_confirmed: "Đã hủy"
  };

  return (
    <div>
      <h3 className="fw-bold mb-3 text-center">Đơn Hàng Của Bạn</h3>
      <div className="container my-4">
        <div className="table-responsive">
          <table className="table table-hover table-bordered text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Mã Đơn Hàng</th>
                <th>Hình Ảnh</th>
                <th>Tên Sản Phẩm</th>
                <th>Số Lượng</th>
                <th>Tổng Tiền</th>
                <th>Thanh Toán</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, orderIndex) =>
                order.orderItems.map((item, itemIndex) => (
                  <tr key={`${order._id}-${itemIndex}`}>
                    {itemIndex === 0 && (
                      <td className="fw-bold" rowSpan={order.orderItems.length}>#{order.orderCode}</td>
                    )}
                    <td>
                      <img
                        src={`${UPLOAD_URL}${item.image}` || "/default-image.jpg"}
                        alt={item.name}
                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.amount}</td>
                    {itemIndex === 0 && (
                      <>
                        <td className="text-success fw-bold" rowSpan={order.orderItems.length}>
                          {Number(order.totalPrice).toLocaleString()} VND
                        </td>
                        <td rowSpan={order.orderItems.length}>
                          {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" :
                            order.paymentMethod === "VietQR" ? "Đã thanh toán qua ngân hàng" :
                              order.paymentMethod === "MoMo" ? "Đã thanh toán qua ví MoMo" : order.paymentMethod}
                        </td>
                        <td rowSpan={order.orderItems.length}>
                          <span className={`badge ${order.status === "pending" ? "bg-primary" :
                            order.status === "processing" ? "bg-info text-dark" :
                              order.status === "shipped" ? "bg-warning text-dark" :
                                order.status === "return_requested" ? "bg-danger" :
                                  "bg-light text-dark"}`}>
                            {statusLabels[order.status] || "Không xác định"}
                          </span>
                        </td>
                        <td rowSpan={order.orderItems.length}>
                          <div className="d-flex justify-content-center gap-2 flex-wrap">
                            <button className="btn btn-info btn-sm" onClick={() => { setSelectedOrder(order); setShowModal(true); }}>
                              Chi Tiết
                            </button>

                            {order.status === "pending" ? (
                              <button className="btn btn-outline-danger btn-sm" onClick={() => handleUpdateOrder(order._id, "cancelled")}>
                                Hủy Đơn
                              </button>
                            ) : order.status === "cancelled" ? (
                              <button className="btn btn-secondary btn-sm" onClick={() => handleUpdateOrder(order._id, "pending")}>
                                Thu Hồi
                              </button>
                            ) : null}

                          {order.status === "return" && (
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteOrder(order.orderCode)}>
                              Xóa Đơn
                            </button>
                          )}

                          {order.status === "delivered" && (
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteOrder(order.orderCode)}>
                              Xóa Đơn
                            </button>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default GuestOrderStatus;
