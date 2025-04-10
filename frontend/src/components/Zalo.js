import { useEffect } from "react";

const ZaloChatButton = () => {
  useEffect(() => {
    const tooltip = document.getElementById("zalo-tooltip");
    const icon = document.getElementById("zalo-icon");

    // Ẩn tooltip sau 3 giây
    const timer = setTimeout(() => {
      if (tooltip) {
        tooltip.style.opacity = "0";
        tooltip.style.transform = "translateX(10px)";
      }
    }, 3000);

    // Thêm hiệu ứng hover
    if (icon) {
      icon.addEventListener("mouseover", () => {
        icon.style.transform = "scale(1.05)";
        icon.style.filter = "brightness(1.1)";
      });
      icon.addEventListener("mouseout", () => {
        icon.style.transform = "scale(1)";
        icon.style.filter = "brightness(1)";
      });
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href="https://zalo.me/0585675418"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "5px",
        marginBottom: "8.5%",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
      }}
      id="zalo-chat-button"
    >
      <span
        id="zalo-tooltip"
        style={{
          background: "white",
          color: "#007bff",
          padding: "8px 12px",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: "bold",
          border: "2px solid #007bff",
          boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)",
          whiteSpace: "nowrap",
          opacity: 1,
          transform: "translateX(0)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          pointerEvents: "none",
          position: "absolute",
          right: "85px",
        }}
      >
        Liên hệ Zalo!
      </span>

      <img
        src="/images/zalo.png"
        alt="Zalo Chat"
        style={{
          width: "90px",
          height: "70px",
          borderRadius: "50%",
          transition: "transform 0.3s ease, filter 0.3s ease",
        }}
        id="zalo-icon"
      />
    </a>
  );
};

export default ZaloChatButton;
