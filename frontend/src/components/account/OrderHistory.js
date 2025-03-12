import React, { useState } from "react";

const OrderHistory = ({ orders, setOrders }) => {
  const [reviews, setReviews] = useState({}); // Lưu trạng thái đánh giá của từng đơn hàng

  const handleReview = (id) => {
    setReviews((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <>
      <h5 className="fw-bold mb-3">Lịch Sử Mua Hàng</h5>
      <div 
        className="table-responsive"
        style={{
          maxHeight: orders.length > 5 ? "400px" : "auto",
          overflowY: orders.length > 5 ? "auto" : "visible",
          border: orders.length > 5 ? "1px solid #ddd" : "none",
          borderRadius: "5px",
        }}
      >
        {orders.length === 0 ? (
          <p className="text-center text-muted">Bạn chưa có đơn hàng nào hoàn thành.</p>
        ) : (
          <table className="table table-striped table-hover text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Mã Đơn</th>
                <th>Sản Phẩm</th>
                <th>Số lượng</th>
                <th>Ngày Đặt</th>
                <th>Ngày Giao</th>
                <th>Tổng Tiền</th>
                <th>Đánh Giá</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="fw-bold">#{order.id}</td>
                  <td>{order.productName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.deliveryDate}</td>
                  <td className="text-danger fw-bold">{order.totalPrice} VND</td>
                  <td>
                    {reviews[order.id] ? (
                      <span className="text-success fw-bold">Đã Đánh Giá</span>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleReview(order.id)}
                      >
                        Đánh Giá
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
