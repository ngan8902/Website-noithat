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

                    console.log(items)
                    set({ cartItems: fullItems || [] });
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
                // set({ cartItems: response.data.cart.items || [] });
                return response;
            } catch (error) {
                console.error("Lỗi khi thêm vào giỏ hàng API:", error);
            }
        }
    },

    updateQuantity: async (productId, quantity) => {
        if (!productId) {
            console.error("ID sản phẩm không hợp lệ");
            return;
        }

        if (quantity < 1) {
            get().removeFromCart(productId);
            return;
        }

        const token = getCookie(TOKEN_KEY);
        try {
            if (token) {
                set((state) => {
                    const updatedCart = state.cartItems.map(item =>
                        item.productId === productId ? { ...item, quantity } : item
                    );
                    return { cartItems: updatedCart };
                });

                const response = await axios.put(`${process.env.REACT_APP_URL_BACKEND}/cart/update-cart/${productId}`,
                    { quantity },
                    { headers: { "token": token } }
                );
                console.log(response)
                set({ cartItems: response.data.items || [] });
            } else {
                set((state) => {
                    const updatedCart = state.cartItems.map(item =>
                        item.productId === productId ? { ...item, quantity } : item
                    );
                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                    return { cartItems: updatedCart };
                });
            }
        } catch (error) {
            console.error("Lỗi cập nhật giỏ hàng:", error);
        }
    },

    removeFromCart: async (itemId) => {
        if (!itemId) return;

        const isLastItem = get().cartItems.length === 1;

        const token = getCookie(TOKEN_KEY);

        set((state) => {
            const updatedCart = state.cartItems.filter((item) => item._id !== itemId);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cartItems: updatedCart };
        });

        if (token) {
            try {
                await axios.delete(`${process.env.REACT_APP_URL_BACKEND}/cart/remove-item/${itemId}`, {
                    headers: { token },
                });


                if (isLastItem) {
                    window.location.reload(); 
                } else {
                    await get().fetchCart();
                }
            } catch (error) {
                console.error("Lỗi xóa sản phẩm:", error);

                set((state) => ({
                    cartItems: [...state.cartItems, { _id: itemId }],
                }));
            }
        } else {
            set((state) => {
                const updatedCart = state.cartItems.filter((item) => item._id !== itemId);
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                return { cartItems: updatedCart };
            });
        }
    },

    clearPurchasedItems: async (purchasedItems) => {
        try {
            const token = getCookie("TOKEN_KEY");

            if (token) {
                try {
                    const response = await axios.post(
                        `${process.env.REACT_APP_URL_BACKEND}/cart/clear-purchased`,
                        { purchasedItems },
                        { headers: { "token": token } }
                    );
                    console.log("Đã xóa sản phẩm từ giỏ hàng của khách hàng đã đăng nhập:", response);

                    await get().fetchCart();
                } catch (error) {
                    console.error("Lỗi khi xóa sản phẩm từ giỏ hàng của khách hàng đã đăng nhập:", error);
                }

                set((state) => {
                    const updatedCart = state.cartItems.filter(
                        (item) => !purchasedItems.includes(item._id || item.productId)
                    );
                    console.log("Giỏ hàng sau khi cập nhật (đăng nhập):", updatedCart);

                    localStorage.setItem("cart", JSON.stringify(updatedCart));

                    return { cartItems: updatedCart };
                });

            } else {
                console.log("Khách vãng lai: Giỏ hàng đã được xóa sau khi thanh toán.");

                localStorage.removeItem("cart");

                set((state) => {
                    return { cartItems: [] };
                });
            }
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm sau thanh toán:", error);
        }
    },
}));

export default useCartStore;
