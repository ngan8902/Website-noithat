import React from "react";

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  const product = item.productId && typeof item.productId === "object" && item.productId.data


  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item._id || item.productId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    const maxStock = product?.countInStock || item?.countInStock || 1;
    if (item.quantity < maxStock) {
      updateQuantity(item._id || item.productId, item.quantity + 1);
    }
  };

  const handleRemove = () => {
    const idToRemove = item._id;
    if (idToRemove) {
      removeFromCart(idToRemove);
    }
  };

  const getDiscountedPrice = (price, discount) => 
    typeof price === "number"
      ? (price - (price * (discount || 0)) / 100).toLocaleString()
      : null;
  
  const itemPrice = getDiscountedPrice(item?.price, item?.discount);
  const productPrice = getDiscountedPrice(product?.price, product?.discount);

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
            {product?.discount > 0 || item?.discount > 0 ? (
              <>
                <span className="text-decoration-line-through me-2">
                  {product?.price?.toLocaleString() || item?.price?.toLocaleString()} VND
                </span>
                <span className="text-danger fw-bold">
                {itemPrice || productPrice || "Chưa có giá"} VND
                </span>
              </>
            )
              : (
                <span>{product?.price?.toLocaleString() || item?.price?.toLocaleString()} VND</span>
              )
            }

          </p>

          <div className="d-flex align-items-center">
            <button className="btn btn-outline-dark btn-sm" onClick={handleDecrease} disabled={item.quantity <= 1}>
              -
            </button>
            <span className="mx-2">{item.quantity}</span>
            <button className="btn btn-outline-dark btn-sm" onClick={handleIncrease} disabled={item.quantity >= product?.countInStock || item.quantity >= item?.countInStock}>
              +
            </button>
          </div>
        </div>
      </div>
      <button className="btn btn-danger btn-sm" onClick={handleRemove}>
        Xóa
      </button>
    </div>
  );
};

export default CartItem;
