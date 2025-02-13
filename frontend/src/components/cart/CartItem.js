import React from "react";

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
      <div className="d-flex align-items-center">
        <img
          src={item.image || "https://via.placeholder.com/100"}
          alt={item.name}
          className="img-fluid rounded"
          width="80"
        />
        <div className="ms-3">
          <h6 className="fw-bold mb-1">{item.name}</h6>
          <p className="mb-1 text-muted">
            {item.discount > 0 ? (
              <>
                <span className="text-decoration-line-through me-2">
                  {item.price.toLocaleString()} VND
                </span>
                <span className="text-danger fw-bold">
                  {(item.price - (item.price * item.discount) / 100).toLocaleString()} VND
                </span>
              </>
            ) : (
              <span>{item.price.toLocaleString()} VND</span>
            )}
          </p>
          <div className="d-flex align-items-center">
            <button className="btn btn-outline-dark btn-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
              -
            </button>
            <span className="mx-2">{item.quantity}</span>
            <button className="btn btn-outline-dark btn-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              +
            </button>
          </div>
        </div>
      </div>
      <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
        Xóa
      </button>
    </div>
  );
};

export default CartItem;
