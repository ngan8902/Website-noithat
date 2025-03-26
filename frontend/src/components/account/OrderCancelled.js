import React, { useState, useEffect } from "react";
//import useOrderStore from "../../store/orderStore";

const OrderCancelled = ({ orders = [], setOrders }) => {
  //const { deleteOrder } = useOrderStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orders.length > 0) {
      setLoading(false);
    }
  }, [orders]);

  const cancelledOrders = Array.isArray(orders)
  ? orders.filter((order) => order.status === "cancelled" || order.status === "return" || order.status === "cancelled_confirmed")
  : [];

  const handleDeleteOrder = async (orderId) => {
    // try {
    //   await deleteOrder(orderId);
    //   setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    // } catch (error) {
    //   console.error("Lỗi khi xóa đơn hàng:", error);
    // }
  };

  // const getStatusLabel = (status) => {
  //   switch (status) {
  //     case "pending":
  //       return "Chờ xác nhận";
  //     case "cancelled":
  //       return "Đã hủy";
  //     case "return":
  //       return "Đã hủy";
  //     default:
  //       return "Không xác định";
  //   }
  // };

  return (
    <>
      <h5 className="fw-bold mb-3">Đơn hàng đã hủy</h5>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="text-muted mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : cancelledOrders.length === 0 ? (
        <p className="text-center text-muted">Bạn chưa có đơn hàng nào đã hủy.</p>
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
                {/* <th>Trạng Thái</th> */}
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
                    )) || "Không có dữ liệu"}</td>
                  <td>
                    {order.orderItems?.map((item, index) => (
                      <div key={index}>
                        {item.amount}
                        {index < order.orderItems.length - 1 && <hr style={{ borderTop: "1px solid #aaa" }} />}
                      </div>
                    )) || 1}</td>
                  <td className="text-danger fw-bold">
                    {Number(order.totalPrice || 0).toLocaleString()} VND
                  </td>
                  {/* <td>
                    <span
                      className={`badge ${order.status === "pending" ? "bg-primary" :
                        order.status === "cancelled" ? "bg-danger" : order.status === "return" ? "bg-danger" :
                          "bg-light text-dark"
                        }`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td> */}
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteOrder(order._id)}>
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
