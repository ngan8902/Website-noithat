import React from "react";
import useOrderStore from "../../store/orderStore";

const OrderStatus = ({ orders, setOrders, orderHistory, setOrderHistory }) => {
  const { updateOrderStatus } = useOrderStore();

  const handleCancelOrder = async (id) => {
    await updateOrderStatus(id, "cancelled");
    setOrders(); 
  };

  const handleReturnOrder = async (id) => {
    await updateOrderStatus(id, "pending");
    setOrders();
  };

  const handleConfirmDelivery = async (id) => {
    const confirmedOrder = orders.find(order => order.id === id);
    if (confirmedOrder) {
      await updateOrderStatus(id, "delivered");
      setOrderHistory([...orderHistory, { ...confirmedOrder, status: "delivered" }]);
      setOrders();
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending": return "Chờ xác nhận";
      case "processing": return "Đang xử lý";
      case "shipped": return "Đã giao cho đơn vị vận chuyển";
      case "delivered": return "Giao hàng thành công";
      case "cancelled": return "Đã hủy";
      default: return "Không xác định";
    }
  };

  return (
    <>
      <h5 className="fw-bold mb-3 text-center">Đơn Hàng Của Bạn</h5>
      <div 
        className="table-responsive"
        style={{
          maxHeight: orders.length > 5 ? "400px" : "auto",
          overflowY: orders.length > 5 ? "auto" : "visible",
          border: "1px solid #ddd"
        }}
      >
        <table className="table table-hover table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>Mã Đơn Hàng</th>
              <th>Tên Sản Phẩm</th>
              <th>Số Lượng</th>
              <th>Tổng Tiền</th>
              <th>Phương Thức Thanh Toán</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="fw-bold">#{order.orderCode}</td>
                <td>{order.orderItems?.[0]?.name || "Không có dữ liệu"}</td>
                <td>{order.orderItems?.[0]?.amount || 1}</td>
                <td className="text-success fw-bold">{order.totalPrice.toLocaleString()} VND</td>
                <td>{order.paymentMethod}</td>
                <td>
                <span
                    className={`badge ${
                      order.status === "pending" ? "bg-primary" :
                      order.status === "processing" ? "bg-info text-dark" :
                      order.status === "shipped" ? "bg-warning text-dark" :
                      order.status === "delivered" ? "bg-success" :
                      order.status === "cancelled" ? "bg-danger" :
                      "bg-light text-dark"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  {["pending", "processing"].includes(order.status) ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Hủy Đơn
                    </button>
                  ) : order.status === "delivered" ? (
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleConfirmDelivery(order._id)}
                      >
                        Xác Nhận
                      </button>

                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleReturnOrder(order._id)}
                      >
                        Hoàn Trả
                      </button>
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-muted">Không có đơn hàng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrderStatus;
