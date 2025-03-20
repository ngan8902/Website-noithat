import React, { useState, useEffect } from "react";
import useOrderStore from "../../store/orderStore";

const ConfirmOrderList = ({ onShip, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { orders, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders()
  }, [])


  const filteredOrders = orders
    .filter(order => order.status === "processing")
    .filter(order => {
      const receiverName = order.receiver?.fullname?.toLowerCase() || "";
      const receiverPhone = order.receiver?.phone || "";

      // Kiểm tra nếu bất kỳ sản phẩm nào trong orderItems khớp với searchTerm
      const productMatch = order.orderItems.some(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        receiverName.includes(searchTerm.toLowerCase()) ||
        receiverPhone.includes(searchTerm) ||
        productMatch
      );
    });

  return (
    <div id="confirmed-orders" className="mt-4">
      <h5 className="fw-bold">Danh Sách Đơn Hàng Đã Xác Nhận</h5>

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
            maxHeight: "500px",
            overflowY: "auto",
            overflowX: "none",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
          className="hide-scrollbar"
        >
          <table className="table table-bordered">
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ width: "10%" }}>{order?.receiver?.fullname || "N/A"}</td>
                    <td style={{ width: "8%" }}>{order?.receiver?.phone || "N/A"}</td>
                    <td style={{ width: "30%" }}>{order?.receiver?.address || "N/A"}</td>
                    <td style={{ width: "10%" }}>{order?.orderItems[0]?.name || "N/A"}</td>
                    <td style={{ width: "10%" }}>{Number(order?.totalPrice || 0).toLocaleString()} VND</td>
                    <td style={{ width: "10%" }}>{order?.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : order?.paymentMethod}</td>
                    <td style={{ width: "10%", textAlign: "center", verticalAlign: "middle" }}>
                      <span className="badge bg-info text-dark">{order.status === "processing" ? "Đã xác nhận" : orders.status}</span>
                    </td>
                    <td style={{ width: "15%" , textAlign: "center", verticalAlign: "middle" }}>
                      {order.status === "processing" && (
                        <>
                          <button className="btn btn-success btn-sm me-2" onClick={() => onShip(order._id)}>
                            Giao hàng
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => onCancel(order._id)}>
                            Hủy
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

export default ConfirmOrderList;
