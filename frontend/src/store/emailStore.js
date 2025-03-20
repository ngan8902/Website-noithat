import { create } from "zustand";
import axios from 'axios';

const useMailStore = create((set) => ({
    formData: {
        name: "",
        email: "",
        message: "",
    },
    isLoading: false,
    successMessage: "",
    errorMessage: "",
    
    // Cập nhật formData khi người dùng nhập liệu
    setFormData: (newData) => set((state) => ({
        formData: { ...state.formData, ...newData }
    })),

    // Hàm gửi email
    sendMail: async () => {
        set({ isLoading: true, successMessage: "", errorMessage: "" });

        try {
            const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/email/send-mail`, 
                useMailStore.getState().formData
            );

            console.log(response);

            if (response.status === 200) {
                set({
                    successMessage: "Tin nhắn của bạn đã được gửi!",
                    formData: {
                        name: "",
                        email: "",
                        message: "",
                    }
                });
            }
        } catch (error) {
            console.error("Lỗi khi gửi email:", error);
            set({ errorMessage: "Gửi tin nhắn thất bại! Vui lòng thử lại." });
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useMailStore;
