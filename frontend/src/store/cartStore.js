import { create } from "zustand";
import axios from "axios";
import { getCookie } from "../utils/cookie.util";
import { TOKEN_KEY } from "../constants/authen.constant"


const useCartStore = create((set, get) => ({
    cartItems: [],

    // Lấy giỏ hàng từ server
    fetchCart: async () => {
        try {
            const token = getCookie(TOKEN_KEY);
    
            if (token) {
                // Người dùng đã đăng nhập → Lấy giỏ hàng từ API
                const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/cart/get-cart`, {
                    headers: { "token": token }
                });
    
                if (response.data) {
                    set({ cartItems: response.data.items || [] });
                    console.log("Giỏ hàng từ API:", response.data);
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
    addToCart: (product) => {
        const token = getCookie(TOKEN_KEY);
    
        if (token) {
            // Người dùng đăng nhập → Gửi API
            axios.post(`${process.env.REACT_APP_URL_BACKEND}/cart/add`, { productId: product.id, quantity: 1 }, {
                headers: { "token": token }
            }).then(response => {
                set({ cartItems: response.data.items || [] });
                console.log("Thêm vào giỏ hàng API:", response.data);
            }).catch(error => {
                console.error("Lỗi khi thêm vào giỏ hàng:", error);
            });
        } else {
            // Khách vãng lai → Lưu vào LocalStorage
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingItem = cart.find(item => item.id === product.id);
    
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
    
            localStorage.setItem("cart", JSON.stringify(cart));
            set({ cartItems: cart });
            console.log("Thêm vào giỏ hàng (Khách vãng lai):", cart);
        }
    },    

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: (id) => {
        const updatedCart = get().cartItems.filter((item) => item._id !== id);
        set({ cartItems: updatedCart });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.location.reload()
    },

    updateQuantity: async (id, newQuantity) => {
        if (newQuantity <= 0) return; // Ngăn số lượng âm
    
        const token = getCookie(TOKEN_KEY);
        if (token) {
            try {
                const response = await axios.put(
                    `${process.env.REACT_APP_URL_BACKEND}/cart/update-cart`, 
                    { productId: id, quantity: newQuantity }, 
                    { headers: { "token": token } }
                );
    
                console.log("API Response:", response.data); // Kiểm tra phản hồi từ API
                set((state) => ({
                    cartItems: state.cartItems.map(item =>
                        item._id === id ? { ...item, quantity: newQuantity } : item
                    )
                }));
            } catch (error) {
                console.error("Lỗi cập nhật giỏ hàng:", error);
            }
        } else {
            // Nếu là khách vãng lai, cập nhật localStorage
            set((state) => {
                const updatedCart = state.cartItems.map(item =>
                    item._id === id ? { ...item, quantity: newQuantity } : item
                );
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                return { cartItems: updatedCart };
            });
        }
    },    

    // Xóa giỏ hàng sau khi thanh toán
    clearCart: () => {
        set({ cartItems: [] });
        localStorage.removeItem("cart");
    }

}));

export default useCartStore;
