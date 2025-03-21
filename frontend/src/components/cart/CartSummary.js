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

  console.log("Item: "+ selectedProducts)
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title fw-bold text-center">🧾 Tóm Tắt Đơn Hàng</h5>
        <hr />

        {selectedProducts.map((item) => {
          const price = item.productId?.data.price || 0;
          const discount = item.productId?.data.discount || 0;
          const finalPrice = discount ? price - (price * discount) / 100 : price;
          const totalItemPrice = finalPrice * item.quantity;

          return (
            <div key={item._id} className="mb-3">
              <p className="mb-1"><strong>{item.productId?.data.name || "Sản phẩm không xác định"}</strong></p>
              <p className="mb-1">Số lượng: <strong>{item.quantity}</strong></p>
              <p className="mb-1">
                Đơn giá: <strong>{finalPrice.toLocaleString()} VND</strong> 
                {discount > 0 && (
                  <span className="text-danger ms-2">
                    (Đã giảm {discount}%)
                  </span>
                )}
              </p>
              <p className="mb-1">Tổng: <strong>{totalItemPrice.toLocaleString()} VND</strong></p>
              <hr />
            </div>
          );
        })}

        <p className="mb-2"><strong>Tổng Sản Phẩm:</strong> {totalQuantity}</p>
        <p className="mb-2 fw-bold"><strong>Tổng Thanh Toán:</strong> {totalPrice.toLocaleString()} VND</p>
        <hr />

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
