import React, { useState } from "react";

const OrderList = ({ orders, onConfirm, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm lọc đơn hàng theo từ khóa
  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone.includes(searchTerm)
  );

  return (
    <div id="pending-orders" className="mt-4">
      <h5 className="fw-bold">Danh Sách Đơn Hàng</h5>

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

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Khách Hàng</th>
            <th>Số Điện Thoại</th>
            <th>Địa Chỉ</th>
            <th>Sản Phẩm</th>
            <th>Tổng Tiền</th>
            <th>Phương Thức Thanh Toán</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.customer}</td>
                <td>{order.phone}</td>
                <td>{order.address}</td>
                <td>{order.product}</td>
                <td>{order.total} VND</td>
                <td>{order.payment}</td>
                <td>
                  <span className={"badge bg-warning"}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.status === "Đang xử lý" && (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={() => onConfirm(order.id)}>
                        Xác nhận
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => onCancel(order.id)}>
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
  );
};

export default OrderList;
