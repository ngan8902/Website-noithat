import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CartList from "../components/cart/CartList";
import CartSummary from "../components/cart/CartSummary";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy giỏ hàng từ localStorage
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  useEffect(() => {
    if (location.state?.product && location.state?.quantity) {
      const newProduct = location.state.product;
      const quantityToAdd = location.state.quantity;

      const existingProduct = cart.find((item) => item.id === newProduct.id);
      let updatedCart;

      if (existingProduct) {
        updatedCart = cart.map((item) =>
          item.id === newProduct.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      } else {
        updatedCart = [...cart, { ...newProduct, quantity: quantityToAdd }];
      }

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  }, [location.state, cart]);

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) return;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Tính tổng giá trị giỏ hàng
  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + (item.discount ? (item.price - (item.price * item.discount) / 100) * item.quantity : item.price * item.quantity),
    0
  );

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate("/checkout", { state: { cart } });
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-5">Giỏ Hàng</h2>
        <div className="row">
          <div className="col-md-8 mb-4">
            <CartList cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
          </div>

          <div className="col-md-4 mb-4">
            <CartSummary cart={cart} totalPrice={totalPrice} handleCheckout={handleCheckout} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
