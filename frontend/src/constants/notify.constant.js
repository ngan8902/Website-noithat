import { toast } from "react-toastify";

export const notifyOfCart = () => {
    toast.success("🛒 Đã thêm vào giỏ hàng!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
}