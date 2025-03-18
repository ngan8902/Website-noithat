import React from "react";

const OrderCancelled = ({ orders }) => {
  const cancelledOrders = orders.filter((order) => order.status === "cancelled");

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  return (
    <>
      <h5 className="fw-bold mb-3">Đơn hàng đã hủy</h5>
      <div
        className="table-responsive"
        style={{
          maxHeight: cancelledOrders.length > 5 ? "400px" : "auto",
          overflowY: cancelledOrders.length > 5 ? "auto" : "visible",
          border: cancelledOrders.length > 5 ? "1px solid #ddd" : "none",
          borderRadius: "5px",
        }}
      >
        {cancelledOrders.length === 0 ? (
          <p className="text-center text-muted">Bạn chưa có đơn hàng nào đã hủy.</p>
        ) : (
          <table className="table table-striped table-hover text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Mã Đơn</th>
                <th>Hình Ảnh</th>
                <th>Sản Phẩm</th>
                <th>Số Lượng</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>

            <tbody>
              {cancelledOrders.map((order) => (
                <tr key={order._id}>
                  <td className="fw-bold">#{order.orderCode}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={order.orderItems[0]?.image || "/default-image.jpg"}
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
                  <td>{order.orderItems.map((item) => item.name).join(", ")}</td>
                  <td>{order.orderItems.reduce((acc, item) => acc + item.amount, 0)}</td>
                  <td className="text-danger fw-bold">
                    {Number(order.totalPrice || 0).toLocaleString()} VND
                  </td>
                  <td>
                    <span
                      className={`badge ${order.status === "pending" ? "bg-primary" :
                              order.status === "cancelled" ? "bg-danger" :
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
        )}
      </div>
    </>
  );
};

export default OrderCancelled;
