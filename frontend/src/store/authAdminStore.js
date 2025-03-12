import { create } from "zustand";
import axios from 'axios';
import { getCookie } from "../utils/cookie.util";
import { STAFF_TOKEN_KEY } from '../constants/authen.constant';

const useAuthAdminStore = create((set, get) => ({
    staff: null,
    staffList: [],
    auth: () => {
        return axios.get(`${process.env.REACT_APP_URL_BACKEND}/staff/getme`, {
            headers: {
                'staff-token': getCookie(STAFF_TOKEN_KEY)
            }
        }).then(response => {
            console.log(response);
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
        if(!staffs || !staffs.role_id) return false;
        if(!roles || !Array.isArray(roles)) return false;

        const isAllowAccess = roles.includes(staffs.role_id);
        return isAllowAccess;
    }
}));

export default useAuthAdminStore;