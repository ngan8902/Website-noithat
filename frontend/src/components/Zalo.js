import { useEffect, useState } from "react";

const ZaloChatButton = () => {
  const [showZalo, setShowZalo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowZalo(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showZalo) return;

    const tooltip = document.getElementById("zalo-tooltip");
    const icon = document.getElementById("zalo-icon");

    // Ẩn tooltip sau 3 giây
    const timer = setTimeout(() => {
      if (tooltip) {
        tooltip.style.opacity = "0";
        tooltip.style.transform = "translateX(10px)";
      }
    }, 2000);

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
  }, [showZalo]);

  return (
    showZalo && (
    <a
      href="https://zalo.me/0585675418"
      target="_blank"
      rel="noopener noreferrer"
      className="zalo-button"
      id="zalo-chat-button"
    >
      <span className="zalo-tooltip" id="zalo-tooltip">
        Liên hệ Zalo!
      </span>

      <img
        src="/images/zalo.png"
        alt="Zalo Chat"
        className="zalo-icon"
        id="zalo-icon"
      />
    </a>
    )
  );
};

export default ZaloChatButton;
