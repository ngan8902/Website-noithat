import React from "react";

const CartSummary = ({ cart , totalPrice, handleCheckout }) => {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title fw-bold">🧾 Tóm Tắt Đơn Hàng</h5>
        <p className="mb-1"><strong>Tổng Sản Phẩm:</strong> {totalQuantity}</p>
        <p className="mb-1"><strong>Tổng Tiền:</strong> {totalPrice.toLocaleString()} VND</p>
        <p className="mb-1 fw-bold"><strong>Tổng Thanh Toán:</strong> {totalPrice.toLocaleString()} VND</p>
        <button className="btn btn-primary w-100 mt-3" onClick={handleCheckout} disabled={cart.length === 0}>
          Thanh Toán
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
