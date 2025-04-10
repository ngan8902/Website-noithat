import { create } from "zustand";
import axios from 'axios';
import { getCookie } from "../utils/cookie.util";
import { TOKEN_KEY } from "../constants/authen.constant";

const useOrderStore = create((set, get) => ({
    order: null,
    orders: [],
    receivers: {},

    fetchOrders: async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/order/get-all-orders`);
            let orders = response.data.data || [];

            set({ orders });

        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng:", error);
            set({ error: error.message });
        }
    },

    getReceiver: async (receiverId) => {
        const { receivers } = useOrderStore.getState();

        if (receivers[receiverId]) {
            return receivers[receiverId];
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/address/get-receiver/${receiverId}`);
            set((state) => ({
                receivers: { ...state.receivers, [receiverId]: response.data }
            }));

            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy receiver:", error);
            return null;
        }
    },

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

                set({ orders: fullOrders });
            }
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng của người dùng:", error);
        }
    },


    updateOrderStatus: async (orderId, newStatus) => {
        if (!["pending", "processing", "shipped", "delivered", "cancelled", "return", "received", "return_requested", "cancelled_confirmed"].includes(newStatus)) {
            return;
        }

        set((state) => ({
            orders: state.orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ),
        }));

        try {
            const response = await axios.put(`${process.env.REACT_APP_URL_BACKEND}/order/update-order-status/${orderId}`,
                { status: newStatus });

            if (response.data.status !== "OK") {
                throw new Error("Cập nhật thất bại!");
            }

            if (newStatus === "cancelled_confirmed") {
                const updatedOrder = response.data.updatedOrder;
                if (updatedOrder?.orderItems) {
                    set((state) => ({
                        orders: state.orders.map(order =>
                            order._id === orderId
                                ? { ...order, orderItems: updatedOrder.orderItems }
                                : order
                        ),
                    }));
                }
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
            set((state) => ({
                orders: state.orders.map(order =>
                    order._id === orderId ? { ...order, orderStatus: "pending" } : order
                ),
            }));
        }
    },

    deleteOrderById: async (orderId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`${process.env.REACT_APP_URL_BACKEND}/order/delete-orders/${orderId}`);
            set((state) => ({
                orders: state.orders.filter((order) => order._id !== orderId),
                loading: false
            }));
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    setOrders: (orders) => set({ orders }),

}))

export default useOrderStore;