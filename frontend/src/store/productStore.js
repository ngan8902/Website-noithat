import { create } from "zustand";
import axios from 'axios';
import { getCookie } from "../utils/cookie.util";
import { STAFF_TOKEN_KEY } from "../constants/authen.constant";

const useProductStore = create((set) => ({
    products: [],
    totalProducts: 0,
    currentPage: 0,
    productByType: [],

    getProducts: (limit = 8, page = 0, filter = "") => {
        axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/all-product`, {
            params: {
                limit,
                page,
                filter
            }
        }).then(response => {
            console.log(response);
            const { data } = response;
            if (data && data.data) {
                const products = data.data;
                set({
                    products: products
                })
            }
        }
        );
    },

    getProductByType: (slug = "", limit = 8, page = 0) => {
        axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/get-product-by-type`, {
            params: {
                limit,
                page,
                slug
            }
        }).then(response => {
            const { data } = response;
            if (data && data.data) {
                const products = data.data;
                set({
                    productByType: products
                })
            }
        }
        );
    },

    getProductDetails: (id) => {
        axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/details-product/${id}`)
        .then(response => {
            console.log("Product details:", response.data);
            if (response.data && response.data.data) {
                set({ products: response.data.data });
            }
        })
        .catch(error => {
            console.error("Error fetching product details:", error);
        });
    },
   
    type: [],
    getType: () => {
        axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/get-all-type`).then(response => {
            console.log('type:', response);
            const { data } = response;
            if (data && data.data) {
                const type = data.data;
                set({
                    type: type
                })
            }
        }
        );
    },

    addProducts: (newProduct) => {
        axios.post(`${process.env.REACT_APP_URL_BACKEND}/product/create-product`, 
            newProduct
        ).then(response => {
            console.log(response);
            set((state) => ({
                products: [...state.products, response.data.data]
            }));
        }).catch(error => {
            console.error('Add Product Error:', error);
        })
    },

    removeProduct: (id) => {
        axios.delete(`${process.env.REACT_APP_URL_BACKEND}/product/delete-product/${id}`).then(response => {
            console.log(response);
            set((state) => ({
                products: state.products.filter((product) => product.id !== id)
            }));

        }
        );
    },

    updateProduct: async (id, updatedData) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_URL_BACKEND}/product/update-product/${id}`,
                updatedData,{
                    headers: {
                        'staff-token':  getCookie(STAFF_TOKEN_KEY)
                    }
                }
            );
            console.log("Cập nhật thành công:", response.data);
            set((state) => ({
                products: state.products.map((product) =>
                    product._id === id ? response.data.data : product
                )
            }));
        } catch (error) {
            console.error("Lỗi cập nhật sản phẩm:", error);
        }
    },
}));

export default useProductStore;