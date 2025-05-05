import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartList from "../components/cart/CartList";
import CartSummary from "../components/cart/CartSummary";
import useCartStore from "../store/cartStore";
import { getCookie } from "../utils/cookie.util";
import { TOKEN_KEY } from "../constants/authen.constant";

const Cart = () => {
  const {
    cartItems,
    cartItemsLocal,
    fetchCart,
    updateQuantity,
    removeFromCart,
    setCartItemsLocal,
    setIsGuest,
    isGuest,
  } = useCartStore();

  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie(TOKEN_KEY);
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (token) {
      setIsGuest(false);
      fetchCart();
    } else {
      setCartItemsLocal(localCart);
      setIsGuest(true);
    }
  }, []);

  const handleCheckout = () => {
    const cart = isGuest ? cartItemsLocal : cartItems;
    const selectedProducts = cart.filter((item) => selectedItems.includes(item._id));
    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
    navigate("/checkout", { state: { selectedProducts } });
  };

  const handleItemRemove = async (itemId) => {
    await removeFromCart(itemId);
  };

  const currentCart = cartItemsLocal.length > 0 ? cartItemsLocal : cartItems;

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-5">Giỏ Hàng</h2>
        <div className="row">
          <div className="col-md-8 mb-4">
            <CartList
              cart={currentCart}
              updateQuantity={updateQuantity}
              removeFromCart={handleItemRemove}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </div>
          <div className="col-md-4 mb-4">
            <CartSummary
              cart={currentCart}
              selectedItems={selectedItems}
              handleCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
