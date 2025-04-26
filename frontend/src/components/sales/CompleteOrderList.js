import React, { useEffect, useState } from "react";
import useOrderStore from "../../store/orderStore";
import { useSearchStore } from '../../store/searchStore';

const CompleteOrderList = ({ onComplete, onReturn, onConfirmCancel }) => {
  const { orders, fetchOrders } = useOrderStore();
  const [filterByStatus, setFilterByStatus] = useState(null);

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  const keyword = removeVietnameseTones(useSearchStore((state) => state.keyword || ""));

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
    .filter(order => 
      // order.status !== "cancelled" && 
      order.status !== "cancelled_confirmed" && 
      order.status !== "pending" && order.status !== "processing" &&
      (filterByStatus ? order.status === filterByStatus : true)
    )
    .filter(order => {
      const receiverName = removeVietnameseTones(order.receiver?.fullname || "");
      const receiverPhone = (order.receiver?.phone || "").toLowerCase();
      const orderCodeFilter = removeVietnameseTones(order?.orderCode || "");

      const productMatch = order.orderItems.some(item =>
        removeVietnameseTones(item.name).includes(keyword)
      );

      return (
        receiverName.includes(keyword) ||
        receiverPhone.includes(keyword) ||
        orderCodeFilter.includes(keyword) ||
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

  const returnRequestedCount = filteredOrders.filter(order => order.status === "return_requested").length;
  const shippingCount = filteredOrders.filter(order => order.status === "received").length;
  const cancelledCount = filteredOrders.filter(order => order.status === "cancelled").length;

  return (
    <div id="completed-orders" className="mt-4">
      <h5 className="fw-bold d-flex justify-content-between align-items-center">
        Danh Sách Đơn Hàng Chờ Hoàn Thành
        <small className="text-muted fs-6">
          <span
            className={`me-3 order-status-hover ${filterByStatus === "return_requested" ? "text-primary fw-bold" : "text-muted"} cursor-pointer`}
            onClick={() => setFilterByStatus(prev => prev === "return_requested" ? null : "return_requested")}
            style={{ cursor: "pointer" }}
          >
            🔄 Yêu cầu trả hàng: <strong>{returnRequestedCount}</strong>
          </span>
          <span
            className={`m-3 order-status-hover ${filterByStatus === "received" ? "text-primary fw-bold" : "text-muted"} cursor-pointer`}
            onClick={() => setFilterByStatus(prev => prev === "received" ? null : "received")}
            style={{ cursor: "pointer" }}
          >
            🚚 Đơn đã giao: <strong>{shippingCount}</strong>
          </span>
          <span
            className={`order-status-hover ${filterByStatus === "cancelled" ? "text-primary fw-bold" : "text-muted"} cursor-pointer`}
            onClick={() => setFilterByStatus(prev => prev === "cancelled" ? null : "cancelled")}
            style={{ cursor: "pointer" }}
          >
            ⏳ Đang chờ hủy: <strong>{cancelledCount}</strong>
          </span>
        </small>

        {filterByStatus && (
          <div className="text-end">
            <button
              className="btn btn-sm btn-outline-secondary mt-2"
              onClick={() => setFilterByStatus(null)}
            >
              Xóa lọc
            </button>
          </div>
        )}
      </h5>

      <div className="d-flex justify-content-between align-items-center mb-3"></div>
        <div style={{ border: "1px solid #ddd", maxHeight: "450px", overflow: "auto", overflowX: "auto" }}>
          <table className="table table-bordered mt-3">
          <thead
            className="table-dark"
            style={{
              textAlign: "center",
              verticalAlign: "middle",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <tr>
              <th style={{ width: "10%" }}>Mã Đơn Hàng</th>
              <th style={{ width: "12%" }}>Khách Hàng</th>
              <th style={{ width: "10%" }}>SĐT</th>
              <th style={{ width: "15%" }}>Địa Chỉ</th>
              <th style={{ width: "15%" }}>Sản Phẩm</th>
              <th style={{ width: "8%" }}>SL</th>
              <th style={{ width: "10%" }}>Tổng Tiền</th>
              <th style={{ width: "12%" }}>Thanh Toán</th>
              <th style={{ width: "10%" }}>Trạng Thái</th>
              <th style={{ width: "10%" }}>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.length > 0 ? (
              sortedOrders.map((order) => (
                <tr key={order._id}>
                  <td>#{order?.orderCode}</td>
                  <td>{order?.receiver?.fullname || "N/A"}</td>
                  <td>{order?.receiver?.phone || "N/A"}</td>
                  <td>{order?.receiver?.address || "N/A"}</td>
                  <td>
                    {order.orderItems?.map((item, index) => (
                      <div key={index}>
                        {item.name}
                        {index < order.orderItems.length - 1 && (
                          <hr style={{ margin: "5px 0", borderTop: "1px solid #555" }} />
                        )}
                      </div>
                    )) || "Không có dữ liệu"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {order.orderItems?.map((item, index) => (
                      <div key={index}>
                        {item.amount}
                        {index < order.orderItems.length - 1 && (
                          <hr style={{ margin: "5px 0", borderTop: "1px solid #555" }} />
                        )}
                      </div>
                    )) || "Không có dữ liệu"}
                  </td>
                  <td>{Number(order?.totalPrice || 0).toLocaleString()} VND</td>
                  <td>
                    {order?.paymentMethod === "COD"
                      ? "Thanh toán khi nhận hàng"
                      : order?.paymentMethod === "VietQR"
                      ? "Chuyển khoản"
                      : order?.paymentMethod}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span
                      className={`badge ${
                        order.status === "return_requested"
                          ? "bg-warning text-dark"
                          : order.status === "received"
                          ? "bg-info text-dark"
                          : order.status === "shipped"
                          ? "bg-primary"
                          : order.status === "delivered"
                          ? "bg-success"
                          : order.status === "return" || order.status === "cancelled"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {order.status === "return_requested"
                        ? "Yêu cầu trả hàng"
                        : order.status === "received"
                        ? "Đã nhận hàng"
                        : order.status === "shipped"
                        ? "Đang giao"
                        : order.status === "delivered"
                        ? "Hoàn thành"
                        : order.status === "return"
                        ? "Đã trả"
                        : order.status === "cancelled"
                        ? "Yêu cầu hủy"
                        : ""}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {["received", "return_requested"].includes(order.status) && (
                      <>
                        {order.status !== "return_requested" && (
                          <button
                            className="btn btn-success btn-sm me-2 mb-1"
                            onClick={() => onComplete(order._id)}
                          >
                            Xác nhận
                          </button>
                        )}
                        {order.status !== "received" && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => onReturn(order._id)}
                          >
                            Trả hàng
                          </button>
                        )}
                      </>
                    )}
                    {order.status === "cancelled" && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onConfirmCancel(order._id, order.orderCode)}
                      >
                        Xác nhận hủy
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  Không tìm thấy đơn hàng nào!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompleteOrderList;
