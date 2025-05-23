import React, { useState, useEffect } from "react";
import useOrderStore from "../../store/orderStore";
import { UPLOAD_URL } from '../../constants/url.constant';

const OrderCancelled = ({ orders = [], setOrders }) => {
  const { updateOrderStatus, deleteOrderById } = useOrderStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orders.length >= 0) {
      setLoading(false);
    }
  }, [orders]);

  const cancelledOrders = Array.isArray(orders)
    ? orders.filter(
      (order) =>
        order?.status === "cancelled" ||
        // order?.status === "return" ||
        order?.status === "cancelled_confirmed"
    )
    : [];

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrderById(orderId);
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
    }
  };

  const handleRecallOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, "pending");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "pending" } : order
        )
      );
    } catch (error) {
      console.error("Lỗi khi thu hồi đơn hàng:", error);
    }
  };

  const statusLabels = {
    cancelled: "Đang chờ hủy",
    cancelled_confirmed: "Đã hủy"
  };

  if (cancelledOrders.length === 0) return null;

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.includes("lh3.googleusercontent.com")) {
      return image;
    }

    if (image.includes("drive.google.com")) {
      const match = image.match(/id=([a-zA-Z0-9_-]+)/);
      const idFromViewLink = image.match(/\/d\/(.*?)\//);
      const id = match ? match[1] : idFromViewLink ? idFromViewLink[1] : null;

      if (id) {
        return `${process.env.REACT_APP_URL_BACKEND}/image/drive-image/${id}`;
      } else {
        console.error("Không thể lấy ID từ Google Drive link:", image);
      }
    }

    // Nếu là link https bình thường
    if (image.startsWith("https://")) {
      return image;
    }

    // Nếu là file local trên server
    return `${UPLOAD_URL}${image}`;
  };


  return (
    <>
      <h5 className="fw-bold mb-3">Đơn hàng chờ hủy</h5>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="text-muted mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : cancelledOrders.length === 0 ? (
        <p className="text-center text-muted">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div
          className="table-responsive"
          style={{
            maxHeight: orders.length > 5 ? "400px" : "auto",
            overflowY: orders.length > 5 ? "auto" : "visible",
            overflowX: "none",
            border: orders.length > 5 ? "1px solid #ddd" : "none",
          }}
        >
          <table className="table table-striped table-hover text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Mã Đơn</th>
                <th>Hình Ảnh</th>
                <th>Sản Phẩm</th>
                <th>Số Lượng</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>

            <tbody>
              {cancelledOrders.map((order) => (
                <tr key={order._id}>
                  <td className="fw-bold">#{order.orderCode}</td>
                  <td>
                    {order.orderItems?.map((item, index) => (
                      <div key={index} className="mb-2">
                        <img
                          src={getImageUrl(item?.image)}
                          alt={item.name}
                          style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                        />
                        {index < order.orderItems.length - 1 && (
                          <hr style={{ margin: "5px 0", borderTop: "1px solid #aaa" }} />
                        )}
                      </div>
                    ))}
                  </td>
                  <td>
                    {order.orderItems?.map((item, index) => (
                      <div key={index}>
                        {item.name}
                        {index < order.orderItems.length - 1 && (
                          <hr style={{ margin: "5px 0", borderTop: "1px solid #aaa" }} />
                        )}
                      </div>
                    )) || "Không có dữ liệu"}
                  </td>
                  <td>
                    {order.orderItems?.map((item, index) => (
                      <div key={index}>
                        {item.amount}
                        {index < order.orderItems.length - 1 && (
                          <hr style={{ borderTop: "1px solid #aaa" }} />
                        )}
                      </div>
                    )) || 1}
                  </td>
                  <td className="text-danger fw-bold">
                    {Number(order.totalPrice || 0).toLocaleString()} VND
                  </td>
                  <td rowSpan={order.orderItems.length}>
                    <span className={`badge ${order.status === "pending" ? "bg-primary" :
                      order.status === "return_requested" ? "bg-danger" :
                        "bg-light text-dark"}`}>
                      {statusLabels[order.status] || "Không xác định"}
                    </span>
                  </td>
                  <td className="d-flex flex-column gap-2">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleRecallOrder(order._id)}
                    >
                      Thu hồi yêu cầu
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OrderCancelled;
