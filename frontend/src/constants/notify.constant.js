import { toast } from "react-toastify";
 

export const notifyOfCart = () => {
    toast.success("🛒 Đã thêm vào giỏ hàng!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        className: "my-toast"
      });
}

export const notifyOfCheckout = () => {
  toast.success("🛍️ Thanh toán thành công!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
}