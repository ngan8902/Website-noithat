import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartList from "../components/cart/CartList";
import CartSummary from "../components/cart/CartSummary";
import useCartStore from "../store/cartStore";
import axios from "axios";

const Cart = () => {
  const { cartItems = [], fetchCart, updateQuantity, removeFromCart } = useCartStore();
  const [cartWithProducts, setCartWithProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSelectedItems = JSON.parse(localStorage.getItem('selectedItems')) || [];
    setSelectedItems(storedSelectedItems);
  }, []);
  
  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (localCart.length > 0) {
        setCartWithProducts(localCart);
    } else {
        fetchCart();
    }
  }, [fetchCart]);

  useEffect(() => {
    if (!Array.isArray(cartItems)) {
      console.warn("cartItems không phải là mảng:", cartItems);
      return;
    }
    const fetchProductDetails = async () => {
      if (cartItems.length === 0) return;

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

  const handleCheckout = () => {
    const selectedProducts = cartWithProducts.filter(item => selectedItems.includes(item._id));
    console.log(selectedProducts)

    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }

    navigate("/checkout", { state: { selectedProducts } });
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-5">Giỏ Hàng</h2>
        <div className="row">
          <div className="col-md-8 mb-4">
            <CartList cart={cartWithProducts} updateQuantity={updateQuantity} removeFromCart={removeFromCart} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
          </div>

          <div className="col-md-4 mb-4">
            <CartSummary cart={cartWithProducts} selectedItems={selectedItems} handleCheckout={handleCheckout} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
