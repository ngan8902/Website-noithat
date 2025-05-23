import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import StarRating from "../StarRating";
import Comments from "../Comments";
import axios from "axios";
import { UPLOAD_URL } from '../../constants/url.constant';

const OrderHistory = ({ orders = [], onReviewSubmit }) => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewedOrders, setReviewedOrders] = useState([]);

  const appElement = document.getElementById('root');

  useEffect(() => {
    if (Array.isArray(orders) && orders.length > 0) {
      setLoading(false);
      setLoading(false);

      const unreviewedDeliveredOrders = orders.filter(
        (order) => order && order.status === "delivered" && (!order.rating || order.rating === 0)
      );

      unreviewedDeliveredOrders.forEach((order) => {
        if (order.isReminderSent === true) return;
        axios.post(`${process.env.REACT_APP_URL_BACKEND}/send/send-review`, {
          orderCode: order.orderCode
        }).then(() => {
          console.log(`Đã gửi mail nhắc đánh giá cho đơn hàng #${order.orderCode}`);
        }).catch((err) => {
          console.error("Lỗi gửi mail nhắc đánh giá:", err);
        });
      });

    } if (orders.length === 0) {
      setLoading(false);
    }
  }, [orders]);

  const Purchased = Array.isArray(orders)
    ? orders.filter((order) => order?.status === "delivered")
    : [];

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "delivered":
        return "Đã giao hàng";
      default:
        return "Không xác định";
    }
  };

  const handleReview = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setRating(order.rating);
  };

  const handleRatingChange = async (rating) => {
    try {
      if (!selectedOrder) {
        console.error("Lỗi: orderId không hợp lệ.");
        return;
      }

      await axios.put(
        `${process.env.REACT_APP_URL_BACKEND}/order/update-order-rating`,
        {
          orderId: selectedOrder._id,
          rating: rating,
        }
      );

      setReviewedOrders([...reviewedOrders, selectedOrder._id]);
    } catch (error) {
      console.error("Lỗi cập nhật rating:", error);
    }
  };

  const handleCommentSubmitSuccess = () => {
    console.log("Comment submitted successfully!");
  };

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
      <h5 className="fw-bold mb-3">Lịch Sử Mua Hàng</h5>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="text-muted mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : Purchased.length === 0 ? (
        <p className="text-center text-muted">Bạn chưa có đơn hàng nào hoàn thành.</p>
      ) : (
        <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto", border: "1px solid #ddd" }}>
          <table className="table table-striped table-hover text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Mã Đơn</th>
                <th>Hình Ảnh</th>
                <th>Sản Phẩm</th>
                <th>Số Lượng</th>
                <th>Ngày Đặt</th>
                <th>Ngày Giao</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Đánh Giá</th>
              </tr>
            </thead>
            <tbody>
              {Purchased.map((order) => (
                <tr key={order._id}>
                  <td className="fw-bold">#{order.orderCode}</td>
                  <td>
                    {order?.orderItems?.map((item, index) => (
                      <div key={index} className="mb-2">
                        <img
                          src={getImageUrl(item?.image)}
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
                    )) || "Không có dữ liệu"}</td>
                  <td> {order.orderItems?.map((item, index) => (
                    <div key={index}>
                      {item.amount}
                      {index < order.orderItems.length - 1 && <hr style={{ borderTop: "1px solid #aaa" }} />}
                    </div>
                  )) || 1}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(order.updatedAt || new Date()).toLocaleDateString()}</td>
                  <td className="text-danger fw-bold">
                    {Number(order.totalPrice || 0).toLocaleString()} VND
                  </td>
                  <td>
                    <span
                      className={`badge ${order.status === "pending" ? "bg-primary" :
                        order.status === "delivered" ? "bg-success" :
                          "bg-light text-dark"
                        }`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    {order.status === "delivered" && (
                      order.rating && order.rating > 0 ? (
                        <span className="text-success">Đã đánh giá</span>
                      ) : (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleReview(order)}>
                          Đánh Giá
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Đánh giá đơn hàng"
        appElement={appElement}
        className="custom-modal"
      >
        {selectedOrder && (
          <div>
            <h2>Đánh giá đơn hàng #{selectedOrder.orderCode}</h2>
            <StarRating
              orderItems={selectedOrder?.orderItems}
              rating={rating}
              onOptionSelect={setRating}
              onRatingChange={handleRatingChange}
            />
            <h3 className="mt-3">Để lại nhận xét cho sản phẩm</h3>
            {selectedOrder.orderItems && selectedOrder.orderItems.map(item => (
              <div key={item?.productId} className="mb-3">
                <h5>{item.name}</h5>
                <Comments
                  productId={item.product._id}
                  onSubmitSuccess={handleCommentSubmitSuccess}
                  orderId={selectedOrder._id}
                />
              </div>
            ))}
            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default OrderHistory;
