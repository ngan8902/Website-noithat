import { create } from "zustand";
import axios from "axios";
import { getCookie } from "../utils/cookie.util";
import { TOKEN_KEY } from "../constants/authen.constant";

const useCartStore = create((set, get) => ({
    cartItems: [],
    cartItemsLocal: [],
    isGuest: true,

    setCartItemsLocal: (cartItems = []) => {
        set({ cartItemsLocal: cartItems });
    },

    setIsGuest: (value) => {
        set({ isGuest: value });
    },

    fetchCart: async () => {
        try {
            const token = getCookie(TOKEN_KEY);

            if (!token) {
                const localCart = JSON.parse(localStorage.getItem("cart")) || [];
                set({ isGuest: true, cartItemsLocal: localCart, cartItems: [] });
                return;
            }

            const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/cart/get-cart`, {
                headers: { token },
            });

            const items = response?.data?.data?.items || [];

            if (items.length > 0) {
                const fullItems = await Promise.all(
                    items.map(async (item) => {
                        try {
                            const res = await axios.get(
                                `${process.env.REACT_APP_URL_BACKEND}/product/details-product/${item.productId}`
                            );
                            return { ...item, product: res.data.data };
                        } catch (err) {
                            console.warn(`Không lấy được thông tin chi tiết sản phẩm ${item.productId}`);
                            return item;
                        }
                    })
                );
                set({ isGuest: false, cartItems: fullItems });
            } else {
                set({ isGuest: false, cartItems: [] });
            }
        } catch (error) {
            console.error("Lỗi khi fetch giỏ hàng:", error);
            // fallback về chế độ guest nếu server fail
            const localCart = JSON.parse(localStorage.getItem("cart")) || [];
            set({ isGuest: true, cartItemsLocal: localCart });
        }
    },

    addToCart: async (product, quantity = 1) => {
        const token = getCookie(TOKEN_KEY);
        if (token) {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_URL_BACKEND}/cart/add-cart`,
                    { productId: product._id, quantity },
                    { headers: { token } }
                );
                set({ cartItems: response.data.cart.items || [] });
                return response;
            } catch (error) {
                console.error("Lỗi khi thêm vào giỏ hàng:", error);
            }
        }
    },

    updateQuantity: async (productId, quantity) => {
        const token = getCookie(TOKEN_KEY);
        const { isGuest, cartItemsLocal, cartItems } = get();

        if (isGuest) {
            const updatedCart = cartItemsLocal.map((item) =>
                item._id === productId ? { ...item, quantity } : item
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            set({ cartItemsLocal: updatedCart });
        } else {
            try {
                await axios.put(
                    `${process.env.REACT_APP_URL_BACKEND}/cart/update-cart/${productId}`,
                    { quantity },
                    { headers: { token } }
                );
                await get().fetchCart();
            } catch (error) {
                console.error("Lỗi updateQuantity:", error);
            }
        }
    },

    removeFromCart: async (itemId) => {
        const token = getCookie(TOKEN_KEY);
        const { isGuest, cartItemsLocal } = get();

        if (isGuest) {
            const updatedCart = cartItemsLocal.filter((item) => item._id !== itemId);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            set({ cartItemsLocal: updatedCart });
        } else {
            try {
                await axios.delete(`${process.env.REACT_APP_URL_BACKEND}/cart/remove-item/${itemId}`, {
                    headers: { token },
                });
                await get().fetchCart();
            } catch (error) {
                console.error("Lỗi xóa sản phẩm server:", error);
            }
        }
    },

    clearPurchasedItems: async (purchasedItems) => {
        const token = getCookie(TOKEN_KEY);
        if (token) {
            try {
                await axios.post(
                    `${process.env.REACT_APP_URL_BACKEND}/cart/clear-purchased`,
                    { purchasedItems },
                    { headers: { token } }
                );
                await get().fetchCart();
            } catch (error) {
                console.error("Lỗi clearPurchasedItems:", error);
            }
        } else {
            const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
            const updatedCart = currentCart.filter((item) => !purchasedItems.includes(item._id));
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            set({ cartItemsLocal: updatedCart });
        }
    },
}));

export default useCartStore;
