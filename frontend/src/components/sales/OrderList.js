import React, { useEffect } from "react";
import useOrderStore from "../../store/orderStore";
import { useSearchStore } from '../../store/searchStore';

const OrderList = ({ onConfirm, onCancel }) => {
  const { orders, fetchOrders } = useOrderStore();
  const keyword = useSearchStore((state) => state.keyword.toLowerCase());

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = orders
    .filter(order => order.status === "pending")
    .filter(order => {
      const receiverName = order.receiver?.fullname?.toLowerCase() || "";
      const receiverPhone = order.receiver?.phone || "";
      const orderCodeFilter = order?.orderCode?.toLowerCase() || "";

      const productMatch = order.orderItems.some(item =>
        item.name.toLowerCase().includes(keyword)
      );

      return (
        receiverName.includes(keyword) ||
        receiverPhone.includes(keyword) ||
        orderCodeFilter.includes(keyword) ||
        productMatch
      );
    });

  return (
    <div id="pending-orders" className="mt-4">
      <h5 className="fw-bold">Danh Sách Đơn Hàng</h5>

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
              <th style={{ width: "9%" }}>Mã Đơn Hàng</th>
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
            maxHeight: "350px",
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
                    <td style={{ width: "9%" }}>#{order?.orderCode}</td>
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
                      <span className="badge bg-warning">{order.status === "pending" ? "Chờ xác nhận" : orders.status}</span>
                    </td>
                    <td style={{ width: "13%", textAlign: "center", verticalAlign: "middle" }}>
                      {order.status === "pending" && (
                        <>
                          <button className="btn btn-success btn-sm me-2"
                            onClick={() => onConfirm(order._id)}>
                            Xác nhận
                          </button>
                          <button className="btn btn-danger btn-sm"
                            onClick={() => onCancel(order._id)}>
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

export default OrderList;
