import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import useOrderStore from "../../store/orderStore";


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
    case "received":
      return "Đã nhận hàng";
    case "return_requested":
      return "Yêu cầu trả hàng";
    case "return":
      return "Đã trả hàng"
    case "cancelled":
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
  const { getReceiver } = useOrderStore();
  const [receiver, setReceiver] = useState(order.receiver);


  useEffect(() => {
    const fetchReceiver = async () => {
      if (typeof order.receiver === "string") {
        try {
          const data = await getReceiver(order.receiver);
          if (data?.status === "OK") {
            setReceiver(data.data);
            console.log("Receiver Data:", data.data);
          } else {
            console.error("Lỗi khi lấy thông tin receiver:", data?.message);
          }
        } catch (error) {
          console.error("Lỗi khi gọi API receiver:", error);
        }
      }
    };

    fetchReceiver();
  }, [order.receiver, getReceiver]);


  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi Tiết Đơn Hàng #{order.orderCode}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="fw-bold text-center mt-3">Thông Tin Khách Hàng</h5>
<<<<<<< HEAD
        <p><strong>Tên khách hàng:</strong> {order.fullname || "Không có dữ liệu"}</p>
        <p><strong>Số điện thoại:</strong> {order.phone || "Không có dữ liệu"}</p>
        <p><strong>Địa chỉ giao hàng:</strong> {order.address || "Không có dữ liệu"}</p>
        <p><strong>Ngày đặt hàng:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleString() : "Không có dữ liệu"}</p>
        <p><strong>Ngày giao dự kiến:</strong> {order.orderDelivery ? new Date(order.orderDelivery).toLocaleString() : "Không có dữ liệu"}</p>
=======
        <p><strong>Tên khách hàng:</strong> {receiver.fullname || "Không có dữ liệu"}</p>
        <p><strong>Số điện thoại:</strong> {receiver.phone || "Không có dữ liệu"}</p>
        <p><strong>Địa chỉ giao hàng:</strong> {receiver.address || "Không có dữ liệu"}</p>
        <p><strong>Ngày đặt hàng:</strong> {order.orderDate || "Không có dữ liệu"}</p>
        <p><strong>Ngày giao dự kiến:</strong> {order.delivered || "Không có dữ liệu"}</p>
>>>>>>> 181f265796a2ca2c9ecc7a1f705cc270af3f7765

        <h5 className="fw-bold mt-3 text-center">Thông Tin Đơn Hàng</h5>
        <p><strong>Phương thức thanh toán:</strong> {getOrderLabel(order.paymentMethod)}</p>
        <p><strong>Phí vận chuyển:</strong> {(order.shoppingFee).toLocaleString()}</p>
        <p><strong>Trạng thái:</strong> {getStatusLabel(order.status)}</p>
        <p><strong>Tổng tiền:</strong> {Number(order.totalPrice || 0).toLocaleString()} VND</p>

        <h5 className="fw-bold">Danh Sách Sản Phẩm</h5>
        <ul>
          {order.orderItems.map((item, index) => {
            const itemTotal = item.price * item.amount;
            const discountAmount = item.discount ? itemTotal * (item.discount / 100) : 0;
            const finalPrice = itemTotal - discountAmount;

            return (
              <li key={index}>
                <strong>{item.name}</strong> - {item.amount} x {Number(finalPrice || 0).toLocaleString()} VND
              </li>
            );
          })}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailModal;
