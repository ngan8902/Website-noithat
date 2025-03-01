import { create } from "zustand";
import axios from 'axios';
import { getCookie } from "../utils/cookie.util";
import { STAFF_TOKEN_KEY } from '../constants/authen.constant';

const useAuthAdminStore = create((set) => ({
    user: null,
    auth: () => {
        return axios.get(`${process.env.REACT_APP_URL_BACKEND}/staff/getme`, {
            headers: {
                'staff-token': getCookie(STAFF_TOKEN_KEY)
            }
        }).then(response => {
            console.log(response);
            const { data } = response;
            if (data && data.data) {
                const user = data.data;
                set({
                    user: user
                })
                return true;
            }
            return false;
        }
        );
    },

    getAllStaff: () => {
        return axios.get(`${process.env.REACT_APP_URL_BACKEND}/staff/all-staff`, {
        }).then(response => {
            console.log(response);
            const { data } = response;
            if (data && data.data) {
                const user = data.data;
                set({
                    user: user 
                })
                return true;
            }
            return false;
        }
        );
    },

    setUser: (userData) => set({ user: userData }),

    removeStaff: (id) => {
        axios.delete(`${process.env.REACT_APP_URL_BACKEND}/staff/delete-staff/${id}`).then(response => {
            console.log(response);
            set((state) => ({
                user: state.users
            }));

        }
        );
    },
}));

export default useAuthAdminStore;