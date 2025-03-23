import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container text-center">
        {/* Social Media Icons */}
        <div className="d-flex justify-content-center mb-3">
          <a href="https://www.facebook.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://www.twitter.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-twitter"></i>
          </a>
          <a href="https://www.instagram.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://www.tiktok.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-tiktok"></i>
          </a>
        </div>

        {/* Contact Information */}
        <p className="mb-1"> <i className="bi bi-geo-alt-fill me-2"></i>Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
        <p className="mb-1"> <i className="bi bi-telephone-fill me-2"></i>Số điện thoại: 0123 456 789</p>
        <p className="mb-2"> <i className="bi bi-bi-envelope-fill me-2"></i>📧 Email: furniture112025@gmail.com</p>

        {/* Đường dẫn nhanh */}
        <div className="mt-3">
          <a href="/about" className="me-3">
            Về Chúng Tôi
          </a>
          <a href="/policy-terms" className="me-3">
            Chính Sách Bảo Mật
          </a>
          <a href="/policy-terms" className="me-3">
            Điều Khoản Sử Dụng
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;