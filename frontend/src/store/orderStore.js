import { create } from "zustand";
import axios from 'axios';
import { getCookie } from "../utils/cookie.util";
import { TOKEN_KEY } from "../constants/authen.constant";

const useOrderStore = create((set) => ({
    order: null,
    orders: [],


    createOrder: async (newOrder) => {
        axios.post(`${process.env.REACT_APP_URL_BACKEND}/order/create-order`,
            newOrder
        ).then(response => {
            set((state) => ({
                order: response.data.data,
                orders: [...state.orders, response.data.data],
            }));
        }).catch(error => {
            console.error('Add Product Error:', error);
        })
    },

    getOrderByUser: async (userId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/order/get-order-by-user`, {
                headers: {
                    'token': getCookie(TOKEN_KEY)
                },
                params: { userId }
            });
    
            console.log("API Response:", response);
    
            if (response.data && response.data.data) {
                const orders = response.data.data || [];
    
                // Lấy thông tin sản phẩm cho từng orderItems trong đơn hàng
                const fullOrders = await Promise.all(orders.map(async (order) => {
                    const orderItemsWithDetails = await Promise.all(order.orderItems.map(async (item) => {
                        if (typeof item.product === "string") {
                            try {
                                const productRes = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/details-product/${item.product}`);
                                return { ...item, productDetails: productRes.data };
                            } catch (error) {
                                console.error("Lỗi lấy chi tiết sản phẩm:", error);
                                return { ...item, productDetails: null };
                            }
                        }
                        return item;
                    }));
    
                    return { ...order, orderItems: orderItemsWithDetails };
                }));
    
                console.log("Dữ liệu đơn hàng sau khi fetch:", fullOrders);
                set({ orders: fullOrders });
            }
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng của người dùng:", error);
        }
    },
    

    updateOrderStatus: async (orderId, newStatus) => {
        if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(newStatus)) {
            return;
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_URL_BACKEND}/orders/update-order-status/${orderId}`, { status: newStatus });

            if (response.data.status === "OK") {
                set((state) => ({
                    orders: state.orders.map(order =>
                        order._id === orderId ? { ...order, orderStatus: newStatus } : order
                    ),
                }));
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        }
    }
}))

export default useOrderStore;