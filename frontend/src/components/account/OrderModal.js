import React from "react";
import { Modal, Button } from "react-bootstrap";

const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "return":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

const getOrderLabel = (paymentMethod) => {
    switch (paymentMethod) {
      case "COD":
        return "Thanh toán khi nhận hàng";
      default:
        return "VNPay";
    }
  };

const OrderDetailModal = ({ order, show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi Tiết Đơn Hàng #{order.orderCode}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="fw-bold text-center mt-3">Thông Tin Khách Hàng</h5>
        <p><strong>Tên khách hàng:</strong> {order.fullname || "Không có dữ liệu"}</p>
        <p><strong>Số điện thoại:</strong> {order.phone || "Không có dữ liệu"}</p>
        <p><strong>Địa chỉ giao hàng:</strong> {order.address || "Không có dữ liệu"}</p>
        <p><strong>Ngày đặt hàng:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleString() : "Không có dữ liệu"}</p>
        <p><strong>Ngày giao dự kiến:</strong> {order.orderDelivery ? new Date(order.orderDelivery).toLocaleString() : "Không có dữ liệu"}</p>

        <h5 className="fw-bold mt-3 text-center">Thông Tin Đơn Hàng</h5>
        <p><strong>Phương thức thanh toán:</strong> {getOrderLabel(order.paymentMethod)}</p>
        <p><strong>Phí vận chuyển:</strong> {order.fee}</p>
        <p><strong>Trạng thái:</strong> {getStatusLabel(order.status)}</p>
        <p><strong>Tổng tiền:</strong> {Number(order.totalPrice || 0).toLocaleString()} VND</p>

        <h5 className="fw-bold">Danh Sách Sản Phẩm</h5>
        <ul>
          {order.orderItems.map((item, index) => (
            <li key={index}>
              <strong>{item.name}</strong> - {item.amount} x {Number(item.price || 0).toLocaleString()} VND
            </li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailModal;
