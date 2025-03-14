import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartList from "../components/cart/CartList";
import CartSummary from "../components/cart/CartSummary";
import useCartStore from "../store/cartStore";

const Cart = () => {
  const { cartItems, fetchCart, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.discount ? (item.price - (item.price * item.discount) / 100) * item.quantity : item.price * item.quantity),
    0
  );


  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/checkout", { state: { cart: cartItems } });
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-5">Giỏ Hàng</h2>
        <div className="row">
          <div className="col-md-8 mb-4">
            <CartList cart={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
          </div>

          <div className="col-md-4 mb-4">
            <CartSummary cart={cartItems} totalPrice={totalPrice} handleCheckout={handleCheckout} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
