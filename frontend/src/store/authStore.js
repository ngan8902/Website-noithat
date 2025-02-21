import { create } from "zustand";
import axios from 'axios';
import { getCookie } from "../utils/cookie.util";
import { TOKEN_KEY } from '../constants/authen.constant';

const useAuthStore = create((set) => ({
    user: null,

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
                    user: user
                })
            }
        }
        );
    },

    // Cập nhật lại user sau khi update thành công
    setUser: (userData) => set({ user: userData })

    // setUpdateUser: (id, userData) => {
    //     if (!id || !userData) {
    //         console.log("id:", id);
    //         return;
    //     }
    //     axios.put(`${process.env.REACT_APP_URL_BACKEND}/user/update-user/${id}`, userData ,{
    //             headers: {
    //                 'token': getCookie(TOKEN_KEY)
    //             }
    //         }).then(response => {
    //         console.log("Kết quả cập nhật:", response.data);
    //         const { data } = response;
    //         if (data && data.data) {
    //             const updateUser = data.data;
    //             set({
    //                 updateUser: updateUser,
    //                 user: data.data,
    //             })
    //         }
    //     }).catch(error => {
    //         console.error("Lỗi cập nhật thông tin người dùng:", error);
    //     });
    // },

}));

export default useAuthStore;