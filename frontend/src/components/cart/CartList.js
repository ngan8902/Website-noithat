import React from "react";
import CartItem from "./CartItem";

const CartList = ({ cart, updateQuantity, removeFromCart, selectedItems, setSelectedItems }) => {

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title fw-bold">Sản Phẩm Trong Giỏ Hàng</h5>
        {cart.length === 0 ? (
          <p className="text-center">Giỏ hàng trống.</p>
        ) : (
          cart.map((item, index) => (
            <CartItem
              key={item._id || index}
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
