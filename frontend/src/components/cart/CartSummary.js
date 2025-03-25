import React from "react";

const CartSummary = ({ cart, selectedItems, handleCheckout }) => {

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

  const selectedProducts = cart.filter((item) => {
    const itemId = item._id ?? (typeof item.productId === "string" ? item.productId : null);
    return itemId && selectedItems.includes(itemId);
  });

  const totalQuantity = selectedProducts.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = selectedProducts.reduce((sum, item) => {
    const productData = item.productId?.data || item.product || item;
    const price = productData.price || 0;
    const discount = productData.discount || 0;
    const finalPrice = discount ? price - (price * discount) / 100 : price;
    
    return sum + finalPrice * item.quantity;
  }, 0);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title fw-bold text-center">🧾 Tóm Tắt Đơn Hàng</h5>
        <hr />

        {selectedProducts.map((item) => {
          const productData = item.productId?.data || item.product || item; 
          const price = productData.price || 0;
          const discount = productData.discount || 0;
          const finalPrice = discount ? price - (price * discount) / 100 : price;
          const totalItemPrice = finalPrice * item.quantity;

          return (
            <div key={item._id || item.productId} className="mb-3">
              <p className="mb-1"><strong>{productData.name || "Sản phẩm không xác định"}</strong></p>
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
