import React, { useState, useEffect } from "react";
import useOrderStore from "../../store/orderStore";
import OrderDetailModal from "./OrderModal";

const OrderStatus = ({ orders = [], setOrders, orderHistory, setOrderHistory }) => {
  const { updateOrderStatus, fetchOrder } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      try {
        const fetchedOrders = await fetchOrder();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
        setOrders([]);
      }
      setLoading(false);
    };

    getOrders();
  }, []);

  // Xử lý cập nhật đơn hàng
  const handleUpdateOrder = async (id, status) => {
    try {
      await updateOrderStatus(id, status);

      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order._id === id ? { ...order, status } : order
        );

        return updatedOrders.filter((order) => order.status !== "cancelled" && order.status !== "return" && order.status !== "received");
      });

      setOrderHistory((prevHistory) => {
        const HistorydOrder = orders.find((order) => order._id === id);
        return HistorydOrder ? [...prevHistory, { ...HistorydOrder, status }] : prevHistory;

      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  const activeOrders = Array.isArray(orders)
  ? orders.filter(order => order.status !== "cancelled" && order.status !== "return" && order.status !== "delivered")
  : [];

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "received":
        return "Đã nhận hàng";
      case "return_requested":
        return "Yêu cầu trả hàng";
      case "return":
        return "Đã trả hàng"
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  return (
    <>
      <h5 className="fw-bold mb-3 text-center">Đơn Hàng Của Bạn</h5>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2 text-muted">Đang tải danh sách đơn hàng...</p>
        </div>
      ) : (
        <div
        className="table-responsive"
        style={{
          maxHeight: orders.length > 5 ? "400px" : "auto",
          overflowY: orders.length > 5 ? "auto" : "visible",
          overflowX: "none",
          border: "1px solid #ddd"
        }}
      >
        <table className="table table-hover table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>Mã Đơn Hàng</th>
              <th>Hình Ảnh</th>
              <th>Tên Sản Phẩm</th>
              <th>Số Lượng</th>
              <th>Tổng Tiền</th>
              <th>Phương Thức Thanh Toán</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {activeOrders.map((order) => (
              <tr key={order._id}>
                <td className="fw-bold">#{order.orderCode}</td>
                <td>
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="mb-2">
                      <img
                        src={item.image || "/default-image.jpg"}
                        alt={item.name}
                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                      />
                      {index < order.orderItems.length - 1 && <hr style={{ margin: "5px 0", borderTop: "1px solid #aaa" }} />}
                    </div>
                  ))}
                </td>
                <td>
                  {order.orderItems?.map((item, index) => (
                    <div key={index}>
                      {item.name}
                      {index < order.orderItems.length - 1 && <hr style={{ margin: "5px 0", borderTop: "1px solid #aaa" }} />}
                    </div>
                  )) || "Không có dữ liệu"}
                </td>
                <td>
                  {order.orderItems?.map((item, index) => (
                    <div key={index}>
                      {item.amount}
                      {index < order.orderItems.length - 1 && <hr style={{ borderTop: "1px solid #aaa" }} />}
                    </div>
                  )) || 1}
                </td>
                <td className="text-success fw-bold">{Number(order?.totalPrice || 0).toLocaleString()} VND</td>
                <td>{order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : order.paymentMethod === "VnPay" ? "Thanh toán qua VnPay" : order.paymentMethod}</td>
                <td>
                  <span
                    className={`badge ${order.status === "pending" ? "bg-primary" :
                      order.status === "processing" ? "bg-info text-dark" :
                        order.status === "shipped" ? "bg-warning text-dark" :
                          order.status === "return_requested" ? "bg-danger" :
                            "bg-light text-dark"
                      }`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-info btn-sm me-2" onClick={() => { setSelectedOrder(order); setShowModal(true); }}>
                      Chi Tiết
                    </button>
                    {["pending"].includes(order.status) ? (
                      <button className="btn btn-danger btn-sm" onClick={() => handleUpdateOrder(order._id, "cancelled")}
                        disabled={order.status === "processing"}>
                        Hủy Đơn
                      </button>
                    ) : order.status === "shipped" ? (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdateOrder(order._id, "received")}>
                          Đã Nhận Hàng
                        </button>
                        <button className="btn btn-warning btn-sm" onClick={() => handleUpdateOrder(order._id, "return_requested")}>
                          Trả Hàng
                        </button>
                      </>
                    ) : null}
                  </div>
                </td>


              </tr>
            ))}
            {activeOrders.length === 0 && (
              <tr>
                <td colSpan="8" className="text-muted">
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      {selectedOrder && <OrderDetailModal order={selectedOrder} show={showModal} handleClose={() => setShowModal(false)} />}
    </>
  );
};

export default OrderStatus;
