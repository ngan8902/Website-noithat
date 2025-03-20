import React from "react";

const CartSummary = ({ cart, selectedItems, totalPrice, handleCheckout }) => {
  if (!selectedItems || selectedItems.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title fw-bold">🧾 Tóm Tắt Đơn Hàng</h5>
          <p className="text-center text-danger">Vui lòng chọn sản phẩm để thanh toán.</p>
        </div>
      </div>
    );
  }

  // Chỉ lấy sản phẩm được chọn
  const selectedProducts = cart.filter((item) => selectedItems.includes(item._id));
  const totalQuantity = selectedProducts.reduce((sum, item) => sum + item.quantity, 0);
  const totalSelectedPrice = selectedProducts.reduce((sum, item) => sum + item.product?.price * item.quantity, 0);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title fw-bold">🧾 Tóm Tắt Đơn Hàng</h5>

        <p className="mb-1"><strong>Tổng Sản Phẩm:</strong> {totalQuantity}</p>
        <p className="mb-1"><strong>Tổng Tiền:</strong> {totalSelectedPrice.toLocaleString()} VND</p>
        <p className="mb-1 fw-bold"><strong>Tổng Thanh Toán:</strong> {totalSelectedPrice.toLocaleString()} VND</p>

        <button
          className="btn btn-primary w-100 mt-3"
          onClick={handleCheckout} 
          disabled={selectedItems.length === 0}
        >
          Thanh Toán
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
