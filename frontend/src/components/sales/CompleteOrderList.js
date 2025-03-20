import React, { useEffect, useState } from "react";
import useOrderStore from "../../store/orderStore";


const CompleteOrderList = ({ onComplete, onReturn }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { orders, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders(orders)
  }, [])


  const filteredOrders = (Array.isArray(orders) ? orders : []).filter(order => {
    const receiverName = order.receiver?.fullname?.toLowerCase() || "";
    const receiverPhone = order.receiver?.phone || "";

    const productMatch = order.orderItems.some(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      receiverName.includes(searchTerm.toLowerCase()) ||
      receiverPhone.includes(searchTerm) ||
      productMatch
    );
  });

  const statusOrder = [
    "shipped",
    "received",
    "return_requested",
  ];

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
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
              <th style={{ width: "10%" }}>Khách Hàng</th>
              <th style={{ width: "8%" }}>Số Điện Thoại</th>
              <th style={{ width: "30%" }}>Địa Chỉ</th>
              <th style={{ width: "10%" }}>Sản Phẩm</th>
              <th style={{ width: "10%" }}>Tổng Tiền</th>
              <th style={{ width: "10%" }}>Phương Thức Thanh Toán</th>
              <th style={{ width: "10%" }}>Trạng Thái</th>
              <th style={{ width: "15%" }}>Hành Động</th>
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
                    <td style={{ width: "10%" }}>{order?.receiver?.fullname || "N/A"}</td>
                    <td style={{ width: "8%" }}>{order?.receiver?.phone || "N/A"}</td>
                    <td style={{ width: "30%" }}>{order?.receiver?.address || "N/A"}</td>
                    <td style={{ width: "10%" }}>{order?.orderItems[0]?.name || "N/A"}</td>
                    <td style={{ width: "10%" }}>{Number(order?.totalPrice || 0).toLocaleString()} VND</td>
                    <td style={{ width: "10%" }}>{order?.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : order?.paymentMethod}</td>
                    <td className="text-center">
                      <span className={`badge ${order.status === "return_requested" ? "bg-warning text-dark" : order.status === "received" ? "bg-info text-dark" : order.status === "shipped" ? "bg-primary" : order.status === "delivered" ? "bg-success" :
                        order.status === "return" ? "bg-danger" :
                          "bg-danger"
                        }`}>
                        {order.status === "return_requested" ? "Yêu cầu trả hàng" : order.status === "received" ? "Đã nhận hàng" : order.status === "shipped" ? "Đã giao hàng" : order.status === "delivered" ? "Đã hoàn thành" :
                          order.status === "return" ? "Đã trả hàng" :
                            "Đã trả hàng"}
                      </span>

                    </td>
                    <td style={{ width: "12%", textAlign: "center" }}>
                      {["shipped", "received", "return_requested"].includes(order.status) && (
                        <>
                          <button className="btn btn-success btn-sm me-2"
                            style={{ marginBottom: "5px" }}
                            onClick={() => onComplete(order._id)}>
                            Xác nhận
                          </button>
                          <button className="btn btn-danger btn-sm"
                            style={{ marginRight: "6px" }}
                            onClick={() => onReturn(order._id)}>
                            Trả hàng
                          </button>
                        </>
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
