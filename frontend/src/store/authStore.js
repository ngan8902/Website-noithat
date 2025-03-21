import { create } from "zustand";
import axios from 'axios';
import { getCookie } from "../utils/cookie.util";
import { TOKEN_KEY } from '../constants/authen.constant';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,

    auth: async () => {
        const token = getCookie(TOKEN_KEY);
        //console.log("Lấy JWT từ cookie:", token);

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_URL_BACKEND}/user/getme`, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Chỉnh lại format
                    },
                    withCredentials: true, // Đảm bảo gửi cookie nếu cần
                }
            );

            //console.log("User Data from API:", response.data);
            const { data } = response;
            if (data && data.data) {
                set({
                    user: data.data,
                    isAuthenticated: true
                });
            }
        } catch (error) {
            console.error("Lỗi khi gọi API /user/getme:", error.response?.data || error.message);
        }
    },

    setUser: (userData) => set({ user: userData, isAuthenticated: !!userData })
}));

export default useAuthStore;
