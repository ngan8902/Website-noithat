import { create } from "zustand";
import axios from "axios";
import { getCookie } from "../utils/cookie.util";
import { TOKEN_KEY } from "../constants/authen.constant"


const useCartStore = create((set, get) => ({
    cartItems: [],

    // Lấy giỏ hàng từ server
    fetchCart: async (userId) => {
        try {
            const token = getCookie(TOKEN_KEY);

            if (token) {
                // Người dùng đã đăng nhập → Lấy giỏ hàng từ API
                const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/cart/get-cart`, {
                    headers: {
                        'token': token
                    },
                    params: { userId }
                });

                if (response.data && response.data.data) {
                    const items = response.data.data.items || [];

                    const fullItems = await Promise.all(items.map(async (item) => {
                        if (typeof item.productId === "string") {
                            const productRes = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/details-product/${item.productId}`);
                            return { ...item, productId: productRes.data };
                        }
                        return item;
                    }));

                    console.log("Dữ liệu giỏ hàng sau khi fetch:", fullItems);
                    set({ cartItems: fullItems });
                } else {
                    console.warn("API không trả về dữ liệu giỏ hàng hợp lệ.");
                }
            } else {
                // Khách vãng lai → Lấy giỏ hàng từ localStorage
                const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || [];
                set({ cartItems: cartFromStorage });
                console.log("Giỏ hàng từ LocalStorage:", cartFromStorage);
            }
        } catch (error) {
            console.error("Lỗi lấy giỏ hàng:", error);
        }
    },

    loadLocalCart: () => {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        set({ cartItems: localCart });
    },

    // Cập nhật giỏ hàng khi thêm sản phẩm
    addToCart: async (product, quantity = 1) => {
        const token = getCookie(TOKEN_KEY);
        if (token) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/cart/add-cart`, { productId: product._id, quantity },
                    { headers: { "token": token } }
                );
                set({ cartItems: response.data.cart.items || [] });
                return response;
            } catch (error) {
                console.error("Lỗi khi thêm vào giỏ hàng API:", error);
            }
        }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: async (productId) => {
        try {
            const token = getCookie(TOKEN_KEY);
            if (token) {
                await axios.delete(`${process.env.REACT_APP_URL_BACKEND}/cart/remove-item/${productId}`, {
                    headers: { "token": token }
                });
            }
    
            // Cập nhật lại state giỏ hàng sau khi xóa sản phẩm
            set((state) => {
                const updatedCart = state.cartItems.filter(item => item.productId !== productId);
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                return { cartItems: updatedCart };
            });
    
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    },
    
    

    updateQuantity: async (id, newQuantity) => {
        if (newQuantity <= 0) return;
    
        const token = getCookie(TOKEN_KEY);
        try {
            if (token) {
                await axios.put(`${process.env.REACT_APP_URL_BACKEND}/cart/update-cart`, 
                    { productId: id, quantity: newQuantity }, 
                    { headers: { "token": token } }
                );
            }
    
            set((state) => {
                const updatedCart = state.cartItems.map(item =>
                    item._id === id ? { ...item, quantity: newQuantity } : item
                );
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                return { cartItems: updatedCart };
            });
    
        } catch (error) {
            console.error("Lỗi cập nhật giỏ hàng:", error);
        }
    },
    

    // Xóa giỏ hàng sau khi thanh toán
    clearCart: () => {
        set({ cartItems: [] });
        localStorage.removeItem("cart");
    }

}));

export default useCartStore;
