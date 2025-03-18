import React from "react";
import useOrderStore from "../../store/orderStore";

const OrderStatus = ({ orders, setOrders, orderHistory, setOrderHistory }) => {
  const { updateOrderStatus } = useOrderStore();

  const handleUpdateOrder = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
  
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order._id === id ? { ...order, status } : order
        );
  
        return updatedOrders.filter((order) => order.status !== "cancelled"); 
      });
  
      setOrderHistory((prevHistory) => {
        const cancelledOrder = orders.find((order) => order._id === id);
        return cancelledOrder ? [...prevHistory, { ...cancelledOrder, status }] : prevHistory;
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };
  

  const activeOrders = orders.filter((order) => order.status !== "cancelled");

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
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
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
          overflowX: "hidden",
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
                          order.status === "delivered" ? "bg-success" :
                            order.status === "cancelled" ? "bg-danger" :
                              "bg-light text-dark"
                      }`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td>
                  {["pending", "processing"].includes(order.status) ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>handleUpdateOrder(order._id, "cancelled")}
                    >
                      Hủy Đơn
                    </button>
                  ) : order.status === "shipped" ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdateOrder(order._id, "delivered")}
                    >
                      Xác Nhận
                    </button>
                  ) : order.status === "delivered" ? (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleUpdateOrder(order._id, "pending")}
                    >
                      Hoàn Trả
                    </button>
                  ) : null}
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
    </>
  );
};

export default OrderStatus;
