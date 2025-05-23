import React, { useState, useEffect } from "react";
import CartItem from "./CartItem";

const CartList = ({ cart, updateQuantity, removeFromCart, selectedItems, setSelectedItems }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cart && cart.length >= 0) {
      setLoading(false);
    }
  }, [cart]);

  console.log(cart)

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title fw-bold">Sản Phẩm Trong Giỏ Hàng</h5>
        
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <p className="text-center">Giỏ hàng trống.</p>
        ) : (
          cart.map((item, index) => (
            <CartItem
              key={item?._id || item.productId?._id || index}
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CartList;
