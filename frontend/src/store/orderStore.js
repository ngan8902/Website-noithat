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

    getOrderByUser: () => {
        axios.get(`${process.env.REACT_APP_URL_BACKEND}/order/get-order-by-user`,
            {
                headers: {
                    'token': getCookie(TOKEN_KEY)
                }
            }
        ).then(response => {
            console.log(response);
            const { data } = response;
            if (data && data.data) {
                const orders = data.data;
                set({
                    orders: orders
                })
            }
        })
    },

}))

export default useOrderStore;