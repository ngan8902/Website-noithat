import { create } from "zustand";
import axios from 'axios';
import { getCookie } from "../utils/cookie.util";
import { STAFF_TOKEN_KEY } from '../constants/authen.constant';

const useAuthAdminStore = create((set, get) => ({
    staff: null,
    staffList: [],
    auth: () => {
        const token = getCookie(STAFF_TOKEN_KEY);

        // Nếu không có token, không gọi API
        if (!token) {
            console.warn("Không có token, bỏ qua xác thực.");
            return Promise.resolve(false);
        }

        return axios.get(`${process.env.REACT_APP_URL_BACKEND}/staff/getme`, {
            withCredentials: true,
            headers: {
                'staff-token': getCookie(STAFF_TOKEN_KEY)
            }
        }).then(response => {
            const { data } = response;
            if (data && data.data) {
                const staff = data.data;
                set({
                    staff: staff
                })
                return true;
            }
            return false;
        }
        );
    },
    permissions: (roles) => {
        const staffs = get().staff;
        if (!staffs || !staffs.role_id) return false;
        if (!roles || !Array.isArray(roles)) return false;

        const isAllowAccess = roles.includes(staffs.role_id);
        return isAllowAccess;
    }
}));

export default useAuthAdminStore;