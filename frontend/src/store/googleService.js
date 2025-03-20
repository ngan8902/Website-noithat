import axios from "axios";

const GoogleService = {
    googleAuth: async (token) => {
        console.log("Token gửi đến backend:", token);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_URL_BACKEND}/auth/google-login`,
                { token },
                { withCredentials: true }
            );

            if (!response.data || typeof response.data !== "object") {
                throw new Error("Phản hồi từ Backend không hợp lệ!");
            }

            console.log("Phản hồi từ Backend:", response.data);
            return response.data;
        } catch (error) {
            console.error("Lỗi Google Login (Frontend):", error.response?.data || error.message);
            throw error;
        }
    },
};

export default GoogleService;
