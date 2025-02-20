import { create } from "zustand"; 
import axios from 'axios';

const useProductStore = create((set) => ({
    products: [],
    getProducts: () => {
        axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/all-product`).then(response => {
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
    
    type: [],
    getType: () => {
        axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/get-all-type`).then(response => {
            console.log('type:',response);
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
}));

export default useProductStore;