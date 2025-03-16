import React from "react";

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
const product = item.productId && typeof item.productId === "object" && item.productId.data 

  return (
    <div key={item._id} className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
      <div className="d-flex align-items-center">
        <img
          src={product?.image || item?.image}
          alt={product?.name || item?.name}
          className="img-fluid rounded"
          width="80"
        />
        <div className="ms-3">
          <h6 className="fw-bold mb-1">{product?.name || item?.name}</h6>
          <p className="mb-1 text-muted">
            {product?.discount || item?.discount > 0 ? (
              <>
                <span className="text-decoration-line-through me-2">
                  {product?.price?.toLocaleString() ||item?.price?.toLocaleString()} VND
                </span>
                <span className="text-danger fw-bold">
                  {(product?.price - (product?.price * product?.discount) / 100)?.toLocaleString() || (item?.price - (item?.price * item?.discount) / 100)?.toLocaleString()} VND
                </span>
              </>
            ) : (
              <span>{product?.price?.toLocaleString() || item?.price?.toLocaleString()} VND</span>
            )}
          </p>
          <div className="d-flex align-items-center">
            <button className="btn btn-outline-dark btn-sm" onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>
              -
            </button>
            <span className="mx-2">{item.quantity}</span>
            <button className="btn btn-outline-dark btn-sm" onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= product?.countInStock || item.quantity >= item?.countInStock}>
              +
            </button>
          </div>
        </div>
      </div>
      <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item._id)}>
        Xóa
      </button>
    </div>
  );
};

export default CartItem;
