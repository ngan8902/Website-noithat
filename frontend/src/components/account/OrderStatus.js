import React, { useState, useEffect, useMemo } from "react";
import useOrderStore from "../../store/orderStore";
import OrderDetailModal from "./OrderModal";
import { UPLOAD_URL } from '../../constants/url.constant';

const OrderStatus = ({ orders = [], setOrders, orderHistory, setOrderHistory }) => {
  const { updateOrderStatus } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orders.length >= 0) {
      setLoading(false);
    }
  }, [orders]);

  // Tạo danh sách đơn hàng hợp lệ
  const activeOrders = useMemo(() =>
    Array.isArray(orders) ? orders.filter(order => !["cancelled", "return", "cancelled_confirmed", "delivered"].includes(order?.status)) : [],
    [orders]
  );

  // Mapping trạng thái đơn hàng
  const statusLabels = {
    pending: "Chờ xác nhận",
    processing: "Đang xử lý",
    shipped: "Đang giao hàng",
    delivered: "Đã giao hàng",
    received: "Đã nhận hàng",
    return_requested: "Đang yêu cầu trả hàng",
    return: "Đã trả hàng",
    cancelled: "Đã hủy",
    cancelled_confirmed: "Đã hủy"
  };

  // Xử lý cập nhật trạng thái đơn hàng
  const handleUpdateOrder = async (id, status) => {
    try {
      await updateOrderStatus(id, status);

      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map(order =>
          order?._id === id ? { ...order, status } : order
        ).filter(order => !["cancelled", "return", "cancelled_confirmed", "received"].includes(order?.status));

        return updatedOrders;
      });

      setOrderHistory((prevHistory) => {
        const updatedOrder = orders.find(order => order._id === id);
        return updatedOrder ? [...prevHistory, { ...updatedOrder, status }] : prevHistory;
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
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
          <p className="text-muted mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : activeOrders.length === 0 ? (
        <p className="text-center text-muted">Không có đơn hàng nào.</p>
      ) : (
        <div
          className="table-responsive"
          style={{
            maxHeight: activeOrders.length > 3 ? "400px" : "auto",
            overflowY: activeOrders.length > 3 ? "auto" : "visible",
            overflowX: "auto",
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
                <th>Thanh Toán</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.map((order) => (
                <tr key={order?._id}>
                  <td className="fw-bold">#{order?.orderCode}</td>
                  <td>
                    {order?.orderItems?.map((item, index) => (
                      <div key={index} className="mb-2">
                        <img
                          src={`${UPLOAD_URL}${item.image}` || "/default-image.jpg"}
                          alt={item.name}
                          style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                        />
                        {index < order.orderItems.length - 1 && <hr style={{ margin: "5px 0", borderTop: "1px solid #aaa" }} />}
                      </div>
                    ))}
                  </td>
                  <td>
                    {order?.orderItems?.map((item, index) => (
                      <div key={index}>
                        {item.name}
                        {index < order?.orderItems?.length - 1 && <hr style={{ margin: "5px 0", borderTop: "1px solid #aaa" }} />}
                      </div>
                    ))}
                  </td>
                  <td>
                    {order?.orderItems?.map((item, index) => (
                      <div key={index}>
                        {item.amount}
                        {index < order?.orderItems?.length - 1 && <hr style={{ borderTop: "1px solid #aaa" }} />}
                      </div>
                    ))}
                  </td>
                  <td className="text-success fw-bold">{Number(order?.totalPrice || 0).toLocaleString()} VND</td>
                  <td>
                    { order?.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" :
                      order?.paymentMethod === "VietQR" ? "Đã thanh toán qua ngân hàng" :
                      order?.paymentMethod === "MoMo" ? "Đã thanh toán qua ví MoMo" : order?.paymentMethod }
                  </td>
                  <td>
                    <span className={`badge ${order?.status === "pending" ? "bg-primary" :
                      order?.status === "processing" ? "bg-info text-dark" :
                        order?.status === "shipped" ? "bg-warning text-dark" :
                          order?.status === "return_requested" ? "bg-danger" :
                            "bg-light text-dark"}`}>
                      {statusLabels[order?.status] || "Không xác định"}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-info btn-sm me-2" onClick={() => { setSelectedOrder(order); setShowModal(true); }}>
                        Chi Tiết
                      </button>
                      {order?.status === "pending" ? (
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleUpdateOrder(order?._id, "cancelled")}>
                          Hủy Đơn
                        </button>
                      ) : order?.status === "shipped" ? (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => handleUpdateOrder(order?._id, "received")}>
                            Đã Nhận Hàng
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleUpdateOrder(order?._id, "return_requested")}>
                            Trả Hàng
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && <OrderDetailModal order={selectedOrder} show={showModal} handleClose={() => setShowModal(false)} />}
    </>
  );
};

export default OrderStatus;
