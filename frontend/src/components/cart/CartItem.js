import React from "react";

const CartItem = ({ item, updateQuantity, removeFromCart, selectedItems, setSelectedItems }) => {
  const product = item.product || item.productId?.data;
  const itemId = item._id || item.productId?._id || item.productId;
  const isSelected = selectedItems.includes(itemId);

  const handleDecrease = () => {
    if (item.quantity > 1 && itemId) {
      updateQuantity(itemId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    const maxStock = product?.countInStock || item?.countInStock || 1;
    if (item.quantity < maxStock && itemId) {
      updateQuantity(itemId, item.quantity + 1);
    }
  };

  const handleRemove = () => {
    if (!itemId) {
      console.error("Không tìm thấy ID sản phẩm để xóa");
      return;
    }
    removeFromCart(itemId);
  };

  const handleSelectItem = () => {
    setSelectedItems((prevSelected) =>
      isSelected ? prevSelected.filter((id) => id !== itemId) : [...prevSelected, itemId]
    );
  };

  const getDiscountedPrice = (price, discount) => {
    if (typeof price !== "number") return null;
    return (price - (price * (discount || 0)) / 100).toLocaleString();
  };

  const itemPrice = getDiscountedPrice(item?.price, item?.discount);
  const productPrice = getDiscountedPrice(product?.price, product?.discount);

  return (
    <div key={itemId} className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
      <div className="d-flex align-items-center">
        <input
          type="checkbox"
          className="form-check-input me-2"
          checked={isSelected}
          onChange={handleSelectItem}
        />
        <img
          src={product?.image || item?.image || "/default-product.png"}
          alt={product?.name || item?.name || "Sản phẩm"}
          className="img-fluid rounded"
          width="80"
        />
        <div className="ms-3">
          <h6 className="fw-bold mb-1">{product?.name || item?.name || "Sản phẩm không xác định"}</h6>
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
            ) : (
              <span>{product?.price?.toLocaleString() || item?.price?.toLocaleString()} VND</span>
            )}
          </p>

          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="mx-2">{item.quantity}</span>
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={handleIncrease}
              disabled={item.quantity >= (product?.countInStock || item?.countInStock || 1)}
            >
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
