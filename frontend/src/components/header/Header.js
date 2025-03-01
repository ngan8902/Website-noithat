import React, { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import useAuthStore from '../../store/authStore';
import { setCookie } from '../../utils/cookie.util';
import { TOKEN_KEY } from '../../constants/authen.constant';
import useProductStore from '../../store/productStore';

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user } = useAuthStore((state) => state);
  const { type, getType} = useProductStore((state) => state);
  const [cartCount, setCartCount] = useState(0);

  const logout = () => {
    setCookie(TOKEN_KEY, '');
    window.location.replace("/home");
  }

  useEffect(() => {
    getType()
  }, [getType])

  useEffect(() => {
    getType();

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    }; 

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  },[getType]);

  const toSlug = (str) => {
    return str
      .toLowerCase()
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .normalize("NFD") // Tách dấu khỏi ký tự
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
      .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu '-'
      .replace(/[^a-z0-9-]/g, "") // Xóa ký tự đặc biệt (nếu có)
      .replace(/-+/g, "-") // Xóa dấu '-' thừa
      .trim();
  };

  return (
    <header className="bg-dark text-white">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src="/images/logo.png" alt="Logo Nội Thất" height="80" width="80" />
        </div>

        <nav className="d-flex align-items-center">
          <ul className="nav">
            <li className="nav-item"><a href="/home" className="nav-link text-white">Trang Chủ</a></li>
            <li className="nav-item dropdown">
              <button className="nav-link text-white dropdown-toggle" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Sản Phẩm
              </button>
              <ul className="dropdown-menu">
                {
                  type.map((i) => {
                    const slug = toSlug(i.name || i);

                    return (
                      <li key={i.id || slug}>
                        <a href={`/product-type/${slug}`} className="dropdown-item fw-normal">
                          {i.name || i}
                        </a>
                      </li>
                    )
                  })
                }
              </ul>
            </li>
            <li className="nav-item"><a href="/about" className="nav-link text-white">Giới Thiệu</a></li>
            <li className="nav-item"><a href="/contact" className="nav-link text-white">Liên Hệ</a></li>
          </ul>
        </nav>

        <div className="d-flex align-items-center">
          <div className="input-group me-3">
            <input type="text" className="form-control text-black border-0" placeholder="Tìm kiếm..." />
            <span className="input-group-text bg-secondary border-0">
              <button className="btn text-white"><i className="bi bi-search"></i></button>
            </span>
          </div>
          <a href="/cart" className="nav-link text-white me-3 position-relative">
            <i className="bi bi-cart-fill"></i>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill">
                {cartCount}
              </span>
            )}
          </a>

          {!!user ? (
            <div className="dropdown">
              <button className="nav-link text-white dropdown-toggle fw-bold" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Chào, {user.name}
              </button>
              <ul className="dropdown-menu">
                <li><a href="/account" className="dropdown-item fw-medium">Thông tin tài khoản</a></li>
                <li><button className="dropdown-item text-danger fw-bolder" onClick={logout}>Đăng xuất</button></li>
              </ul>
            </div>
          ) : (
            <>
              <button className="btn text-white text-decoration-none fw-bold transition-hover" onClick={() => setShowLogin(true)}>Đăng Nhập</button>
              <button className="btn text-white text-decoration-none fw-bold transition-hover" onClick={() => setShowRegister(true)}>Đăng Ký</button>
            </>
          )}
        </div>
      </div>

      <LoginModal show={showLogin} setShow={setShowLogin} setShowRegister={setShowRegister} />
      <RegisterModal show={showRegister} setShow={setShowRegister} setShowLogin={setShowLogin} />
    </header>
  );
};

export default Header;