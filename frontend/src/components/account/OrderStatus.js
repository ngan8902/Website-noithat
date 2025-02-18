import React from "react";

const OrderStatus = ({ orders, setOrders, orderHistory, setOrderHistory }) => {
  // Xử lý hủy đơn hàng
  const handleCancelOrder = (id) => {
    setOrders(
      orders.map(order =>
        order.id === id ? { ...order, status: "Đã Hủy" } : order
      )
    );
  };

  // Xử lý hoàn trả đơn hàng
  const handleReturnOrder = (id) => {
    setOrders(
      orders.map(order =>
        order.id === id ? { ...order, status: "Đang phê duyệt" } : order
      )
    );
  };

  const handleConfirmDelivery = (id) => {
    const confirmedOrder = orders.find(order => order.id === id);
    if (confirmedOrder) {
      setOrderHistory([...orderHistory, { ...confirmedOrder, status: "Giao hàng thành công" }]);
      setOrders(orders.filter(order => order.id !== id));
    }
  };

  return (
    <>
      <h5 className="fw-bold mb-3 text-center">Đơn Hàng Của Bạn</h5>
      <div className="table-responsive">
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
              <tr key={order.id}>
                <td className="fw-bold">#{order.id}</td>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
                <td className="text-success fw-bold">{order.totalPrice} VND</td>
                <td>{order.paymentMethod}</td>
                <td>
                  <span
                    className={`badge ${
                      order.status === "Đang Xác Nhận" ? "bg-primary" :
                      order.status === "Đã Xác Nhận" ? "bg-primary" :
                      order.status === "Đã Giao Cho Đơn Vị Vận Chuyển" ? "bg-warning text-dark" :
                      order.status === "Đang Giao" ? "bg-info text-dark" :
                      order.status === "Giao hành thành công" ? "bg-success" :
                      "bg-danger"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  {["Đang Xác Nhận", "Đã Xác Nhận"].includes(order.status) ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Hủy Đơn
                    </button>
                  ) : order.status === "Giao hàng thành công" ? (
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleConfirmDelivery(order.id)}
                      >
                        Xác Nhận
                      </button>

                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleReturnOrder(order.id)}
                      >
                        Hoàn Trả
                      </button>
                    </div>
                  ) : (
                    null
                  )}
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
