import React, { useEffect, useState } from "react";
import useOrderStore from "../../store/orderStore";


const CompleteOrderList = ({ onComplete, onReturn, onConfirmCancel }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { orders, fetchOrders } = useOrderStore();

  const statusMap = {
    "delivered": "Đã hoàn thành",
    "return": "Đã trả hàng"
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = (Array.isArray(orders) ? orders : [])
    .filter(order => order.status !== "cancelled_confirmed" && order.status !== "pending" && order.status !== "processing")
    .filter(order => {
      const receiverName = order.receiver?.fullname?.toLowerCase() || "";
      const receiverPhone = order.receiver?.phone || "";
      const statusFilter = statusMap[order?.status]?.toLowerCase() || "";
      const orderCodeFilter = order?.orderCode?.toLowerCase() || "";

      const productMatch = order.orderItems.some(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        receiverName.includes(searchTerm.toLowerCase()) ||
        receiverPhone.includes(searchTerm) ||
        statusFilter.includes(searchTerm.toLowerCase()) ||
        orderCodeFilter.includes(searchTerm.toLowerCase()) ||
        productMatch
      );
    });

  const statusOrder = [
    "received",
    "return_requested",
    "cancelled",
    "cancelled_confirmed",
    "shipped",
  ];

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return (statusOrder.indexOf(a.status) !== -1 ? statusOrder.indexOf(a.status) : Infinity) -
      (statusOrder.indexOf(b.status) !== -1 ? statusOrder.indexOf(b.status) : Infinity);
  });


  return (
    <div id="completed-orders" className="mt-4">
      <h5 className="fw-bold">Danh Sách Đơn Hàng Chờ Hoàn Thành</h5>

      <div className="input-group mt-2">
        <span className="input-group-text">
          <button className="btn"><i className="bi bi-search"></i></button>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm theo khách hàng, sản phẩm, số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ border: "1px solid #ddd", maxHeight: "450px", overflow: "hidden" }}>
        <table className="table table-bordered mt-3"  >
          <thead
            className="table-dark"
            style={{
              textAlign: "center",
              verticalAlign: "middle"
            }}
          >
            <tr>
              <th style={{ width: "8%" }}>Mã Đơn Hàng</th>
              <th style={{ width: "10%" }}>Khách Hàng</th>
              <th style={{ width: "8%" }}>Số Điện Thoại</th>
              <th style={{ width: "15%" }}>Địa Chỉ</th>
              <th style={{ width: "10%" }}>Sản Phẩm</th>
              <th style={{ width: "5%" }}>Số lượng</th>
              <th style={{ width: "10%" }}>Tổng Tiền</th>
              <th style={{ width: "10%" }}>Phương Thức Thanh Toán</th>
              <th style={{ width: "8%" }}>Trạng Thái</th>
              <th style={{ width: "13%" }}>Hành Động</th>
            </tr>
          </thead>
        </table>

        <div
          style={{
            maxHeight: "330px",
            overflowY: "auto",
            overflowX: "none",
            scrollbarWidth: "none",
          }}
          className="hide-scrollbar"
        >
          <table className="table table-bordered">
            <tbody>
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order) => (
                  <tr key={order._id}>
                    <th style={{ width: "8%" }}>#{order?.orderCode}</th>
                    <td style={{ width: "10%" }}>{order?.receiver?.fullname || "N/A"}</td>
                    <td style={{ width: "8%" }}>{order?.receiver?.phone || "N/A"}</td>
                    <td style={{ width: "15%" }}>{order?.receiver?.address || "N/A"}</td>
                    <td style={{ width: "10%" }}>
                      {order.orderItems?.map((item, index) => (
                        <div key={index}>
                          {item.name}
                          {index < order.orderItems.length - 1 && <hr style={{ margin: "5px 0", borderTop: "1px solid #555  " }} />}
                        </div>
                      )) || "Không có dữ liệu"}
                    </td>
                    <td style={{ width: "5%", textAlign: "center", verticalAlign: "middle" }}>
                      {order.orderItems?.map((item, index) => (
                        <div key={index}>
                          {item.amount}
                          {index < order.orderItems.length - 1 && <hr style={{ margin: "5px 0", borderTop: "1px solid #555  " }} />}
                        </div>
                      )) || "Không có dữ liệu"}
                    </td>
                    <td style={{ width: "10%" }}>{Number(order?.totalPrice || 0).toLocaleString()} VND</td>
                    <td style={{ width: "10%" }}>{order?.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : order?.paymentMethod}</td>
                    <td style={{ width: "8%", textAlign: "center", verticalAlign: "middle" }}>
                      <span className={`badge ${order.status === "return_requested" ? "bg-warning text-dark" : order.status === "received" ? "bg-info text-dark" : order.status === "shipped" ? "bg-primary" : order.status === "delivered" ? "bg-success" :
                        order.status === "return" ? "bg-danger" : order.status === "cancelled" ? "bg-danger" :
                          "bg-danger"
                        }`}>
                        {order.status === "return_requested" ? "Yêu cầu trả hàng" : order.status === "received" ? "Đã nhận hàng" : order.status === "shipped" ? "Đã giao hàng" : order.status === "delivered" ? "Đã hoàn thành" :
                          order.status === "return" ? "Đã trả hàng" : order.status === "cancelled" ? "Đã hủy" :
                            ""}
                      </span>
                    </td>
                    <td style={{ width: "12%", textAlign: "center", verticalAlign: "middle" }}>
                      {["received", "return_requested"].includes(order.status) && (
                        <>
                          {order.status !== "return_requested" && (
                            <button
                              className="btn btn-success btn-sm me-2"
                              style={{ marginBottom: "5px" }}
                              onClick={() => onComplete(order._id)}
                            >
                              Xác nhận
                            </button>
                          )}

                          {order.status !== "received" && (
                            <button
                              className="btn btn-danger btn-sm"
                              style={{ marginRight: "6px" }}
                              onClick={() => onReturn(order._id)}
                            >
                              Trả hàng
                            </button>
                          )}
                        </>
                      )}

                      {order.status === "cancelled" && (
                        <button
                          className="btn btn-warning btn-sm"
                          style={{ marginBottom: "5px" }}
                          onClick={() => onConfirmCancel(order._id)}
                        >
                          Xác nhận hủy
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-muted">Không tìm thấy đơn hàng nào!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompleteOrderList;
