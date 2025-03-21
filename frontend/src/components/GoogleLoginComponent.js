import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import GoogleService from "../store/googleService";
import googleStore from "../store/googleStore";

const GoogleLoginComponent = ({ onSuccess }) => {
    const navigate = useNavigate();
    const { loginWithGoogle } = googleStore();

    const handleSuccess = async (credentialResponse) => {
        try {
            const googleToken = credentialResponse.credential;
            //console.log("Google Token:", googleToken);

            const response = await GoogleService.googleAuth(googleToken);
            //console.log("Dữ liệu trả về từ Backend:", response);

            loginWithGoogle(response.user, response.token);
            onSuccess();
            navigate("/account");
        } catch (error) {
            console.error("Lỗi đăng nhập Google:", error);
        }
    };

    const handleError = () => {
        console.error("Lỗi đăng nhập Google");
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
        />
    );
};

export default GoogleLoginComponent;
