import { create } from "zustand";
import axios from 'axios';
import { getCookie } from "../utils/cookie.util";
import { TOKEN_KEY } from '../constants/authen.constant';

const useAuthStore = create((set) => ({
    user: null,

    isAuthenticated: false,

    auth: () => {
        axios.get(`${process.env.REACT_APP_URL_BACKEND}/user/getme`, {
            headers: {
                'token': getCookie(TOKEN_KEY)
            }
        }).then(response => {
            const { data } = response;
            if (data && data.data) {
                const user = data.data;
                set({
                    user: user,
                    isAuthenticated: true
                })
            }
        }
        );
    },

    // Cập nhật lại user sau khi update thành công
    setUser: (userData) => set({ user: userData, isAuthenticated: !!userData })
}));

export default useAuthStore;