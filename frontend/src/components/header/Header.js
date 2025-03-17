import React, { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import useAuthStore from '../../store/authStore';
import { setCookie } from '../../utils/cookie.util';
import { TOKEN_KEY } from '../../constants/authen.constant';
import useProductStore from '../../store/productStore';
import useCartStore from '../../store/cartStore';

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user } = useAuthStore((state) => state);
  const { type, getType, suggestions = [], getSuggestions, searchProducts} = useProductStore((state) => state);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm.length > 0) {
      getSuggestions(searchTerm);
    } else {
      getSuggestions("");
    }
  }, [searchTerm, getSuggestions]);

  const handleSearch = () => {
      if (searchTerm.trim() !== "") {
          searchProducts(searchTerm);
          window.location.href = `/search?query=${searchTerm}`;
      }
  };

  const { fetchCart, cartItems } = useCartStore();

  const logout = () => {
    setCookie(TOKEN_KEY, '');
    window.location.replace("/home");
  }

  useEffect(() => {
    getType()
  }, [getType])

  useEffect(() => {
    const updateCartCount = () => {
      if (user) {
        fetchCart();
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } else {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      }
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
    
  }, [user, cartItems, fetchCart]);

  const toSlug = (str) => {
    return str
      .toLowerCase()
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
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
            <li className="nav-item"><a href="/home" className="nav-link text-white fs-6">Trang Chủ</a></li>
            <li className="nav-item dropdown">
              <button className="nav-link text-white dropdown-toggle fs-6" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
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
            <li className="nav-item"><a href="/about" className="nav-link text-white fs-6">Giới Thiệu</a></li>
            <li className="nav-item"><a href="/contact" className="nav-link text-white fs-6">Liên Hệ</a></li>
          </ul>
        </nav>

        <div className="d-flex align-items-center">
          <div className="search-bar input-group me-3">
            <input
              type="text"
              className="form-control text-black border-0"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn bg-primary text-white" onClick={handleSearch}>
              <i className="bi bi-search"></i>
            </button>

            {suggestions && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((product) => (
                  <li key={product._id} onClick={() => setSearchTerm(product.name)}>
                    {product.name}
                  </li>
                  ))}
              </ul>
            )}
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
              <button className="nav-link text-white dropdown-toggle fw-bold m-3" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Chào, {user.name}
              </button>
              <ul className="dropdown-menu">
                <li><a href="/account" className="dropdown-item fw-medium">Thông tin tài khoản</a></li>
                <li><button className="dropdown-item text-danger" onClick={logout}>Đăng xuất</button></li>
              </ul>
            </div>
          ) : (
            <>
              <button className="nav-link text-white text-decoration-none fw-bold m-3" onClick={() => setShowLogin(true)}>Đăng Nhập</button>
              <button className="nav-link text-white text-decoration-none fw-bold m-3" onClick={() => setShowRegister(true)}>Đăng Ký</button>
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