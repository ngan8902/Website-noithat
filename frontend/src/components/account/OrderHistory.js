import React, { useState, useEffect } from "react";

const OrderHistory = ({ orders = [] }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orders.length > 0) {
      setLoading(false);
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
        <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ddd" }}>
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
              </tr>
            </thead>
            <tbody>
              {Purchased.map((order) => (
                <tr key={order._id}>
                  <td className="fw-bold">#{order.orderCode}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={`http://localhost:8000${order.orderItems[0]?.image}` || "/default-image.jpg"}
                        alt={order.orderItems[0]?.name || "Sản phẩm"}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
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
                  <td>{new Date(order.cancelledAt || new Date()).toLocaleDateString()}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OrderHistory;
