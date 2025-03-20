import { create } from "zustand";
import { setCookie, removeCookie } from "../utils/cookie.util";
import { TOKEN_KEY } from '../constants/authen.constant';

const googleStore = create((set) => ({
    user: null,
    isAuthenticated: false,

    // Xử lý đăng nhập Google
    loginWithGoogle: (userData, token) => {
        if (!token) {
            console.error("Lỗi: token bị undefined");
            return;
        }

        console.log("Lưu user vào Zustand:", userData);
        set({ user: userData, isAuthenticated: true });

        // Lưu token vào cookie
        setCookie(TOKEN_KEY, token, 1);  // Lưu token trong 1 ngày
    },

    // Đăng xuất
    logout: () => {
        removeCookie(TOKEN_KEY);  // Xóa token khi logout
        set({ user: null, isAuthenticated: false });
    },
}));

export default googleStore;
