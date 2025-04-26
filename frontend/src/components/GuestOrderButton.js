import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const GuestOrderButton = () => {
  const { user } = useAuthStore();
  const [guestOrderCodes, setGuestOrderCodes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const codes = JSON.parse(localStorage.getItem("guestOrderCodes")) || [];
      setGuestOrderCodes(codes);
    } catch (error) {
      console.error("Lỗi đọc guestOrderCodes:", error);
    }
  }, []);

  if (user || guestOrderCodes.length === 0) return null;

  return (
    <button
      onClick={() => navigate("/guest-order")}
      style={{
        position: "fixed",
        top: "80px",
        right: "20px",
        zIndex: 1000,
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "999px",
        padding: "12px 20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        cursor: "pointer",
        transition: "all 0.3s",
      }}
    >
      📦 Đơn hàng của bạn
    </button>
  );
};

export default GuestOrderButton;
