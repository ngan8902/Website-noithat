import React, { useEffect } from "react";
import useOrderStore from "../../store/orderStore";
import { useSearchStore } from '../../store/searchStore';

const ConfirmOrderList = ({ onShip, onCancel }) => {
  const { orders, fetchOrders } = useOrderStore();

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
    fetchOrders()
  }, [])

  const filteredOrders = orders
    .filter(order => order.status === "processing")
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

  return (
    <div id="confirmed-orders" className="mt-4">
      <h5 className="fw-bold d-flex align-items-center justify-content-between">
        Danh Sách Đơn Hàng Đã Xác Nhận
        {filteredOrders.length > 0 && (
          <span className="ms-2 text-muted">
            <i className="bi bi-bell-fill"></i> {filteredOrders.length} đơn chờ giao hàng
          </span>
        )}
      </h5>
      
      <div style={{ maxHeight: "450px", overflow: "auto", border: "1px solid #ddd" }}>
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
              <th>Mã Đơn Hàng</th>
              <th>Khách Hàng</th>
              <th>Số Điện Thoại</th>
              <th>Địa Chỉ</th>
              <th>Sản Phẩm</th>
              <th>Số lượng</th>
              <th>Tổng Tiền</th>
              <th>Phương Thức Thanh Toán</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
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
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
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
                      ? "Thanh toán chuyển khoản"
                      : order?.paymentMethod}
                  </td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <span className="badge bg-info text-dark">
                      {order.status === "processing" ? "Đã xác nhận" : order.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    {order.status === "processing" && (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => onShip(order._id)}
                        >
                          Giao hàng
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onCancel(order._id)}
                        >
                          Hủy
                        </button>
                      </>
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

export default ConfirmOrderList;
