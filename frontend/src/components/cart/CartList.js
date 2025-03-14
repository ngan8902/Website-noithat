import React from "react";
import CartItem from "./CartItem";

const CartList = ({ cart, updateQuantity, removeFromCart }) => {
  if (!cart || cart.length === 0) {
    return <p className="text-center">Giỏ hàng trống.</p>;
  }
  
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title fw-bold">Sản Phẩm Trong Giỏ Hàng</h5>
        {cart.length === 0 ? (
          <p className="text-center">Giỏ hàng trống.</p>
        ) : (
          cart.map((item) => (
            <CartItem  key={item._id || item.id} 
            item={item} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart}  />
          ))
        )}
      </div>
    </div>
  );
};

export default CartList;
