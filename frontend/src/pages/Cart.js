import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartList from "../components/cart/CartList";
import CartSummary from "../components/cart/CartSummary";
import useCartStore from "../store/cartStore";
import axios from "axios";

const Cart = () => {
  const { cartItems, fetchCart, updateQuantity, removeFromCart } = useCartStore();
  const [cartWithProducts, setCartWithProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!cartItems || cartItems.length === 0) return;

      const updatedCart = await Promise.all(
        cartItems.map(async (item) => {
          if (typeof item.productId === "string") {
            try {
              const response = await axios.get(
                `${process.env.REACT_APP_URL_BACKEND}/product/details-product/${item.productId}`
              );
              return { ...item, product: response.data.data };
            } catch (error) {
              console.error("Lỗi lấy sản phẩm:", error);
              return item;
            }
          }
          return item;
        })
      );

      setCartWithProducts(updatedCart);
    };
    
    fetchProductDetails();
  }, [cartItems]);

  

  const totalPrice = cartWithProducts.reduce((sum, item) => {
    let product;
  
    if (item.productId && typeof item.productId === "object" && item.productId.data) {
      product = item.productId.data;
    } 
    else if (item._id) {
      product = item; 
    } else {
      return sum; 
    }
  
    if (!product || typeof product !== "object") {
      return sum;
    }
  
    const price = product?.price || 0;
    const discount = product?.discount || 0;
  
    const finalPrice = discount
      ? (price - (price * discount) / 100) * (item.quantity || 1)
      : price * (item.quantity || 1);
  
    return sum + finalPrice;
  }, 0);
  
  
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
            <CartList cart={cartWithProducts} updateQuantity={updateQuantity} removeFromCart={removeFromCart}  />
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
