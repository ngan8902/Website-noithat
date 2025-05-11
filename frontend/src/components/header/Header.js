import React, { useState, useEffect, useRef } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import useAuthStore from '../../store/authStore';
import useProductStore from '../../store/productStore';
import useCartStore from '../../store/cartStore';
import { Link } from "react-router-dom";
import axios from "axios";
import { removeCookie } from "../../utils/cookie.util";
import { TOKEN_KEY } from "../../constants/authen.constant";

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user } = useAuthStore((state) => state);
  const { type, getType, suggestions = [], getSuggestions, searchProducts } = useProductStore((state) => state);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const hasFetchedCart = useRef(false);

  useEffect(() => {
    if (searchTerm.length > 0) {
      getSuggestions(searchTerm);
    } else {
      getSuggestions("");
    }
  }, [searchTerm, getSuggestions]);

  const handleSearch = (term = searchTerm) => {
    if (typeof term === "string" && term.trim() !== "") {
      searchProducts(term);
      window.location.href = `/search?query=${term}`;
    }
  };

  const { fetchCart, cartItems } = useCartStore();

  const logout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/logout`, {}, {
        withCredentials: true,
      });
      removeCookie(TOKEN_KEY)
      localStorage.removeItem('user');
      window.location.href = '/';
    } catch (error) {
      console.error("Đã xảy ra lỗi khi đăng xuất", error);
    }
  };

  useEffect(() => {
    getType()
  }, [])

  useEffect(() => {
    const updateCartCount = () => {
      let totalItems = 0;

      if (user) {
        if (Array.isArray(cartItems)) {
          totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        }
      } else {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      }

      setCartCount(totalItems);
    };

    if (user && cartItems.length === 0 && !hasFetchedCart.current) {
      hasFetchedCart.current = true;
      fetchCart();
    }
    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };

  }, [cartItems, user]);

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
      <div className="container py-2">
        <div className="d-flex">
          <div className="justify-content-between align-items-center">
            <Link to="/home" className="d-flex align-items-center">
              <img src="/images/logo.png" alt="Logo Nội Thất" height="80" width="80" />
            </Link>

            <button
              className="navbar-toggler d-lg-none border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNavbar"
              aria-controls="mainNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="bi bi-list text-white fs-2"></i>
            </button>
          </div>
          
          <div className="collapse navbar-collapse d-lg-flex justify-content-between align-items-center mt-3 mt-lg-0" id="mainNavbar">
            <nav className="mb-3 mb-lg-0">
              <ul className="nav flex-column flex-lg-row align-items-start align-items-lg-center m-3">
                <li className="nav-item"><a href="/home" className="nav-link text-white fs-6">Trang Chủ</a></li>
                <li className="nav-item dropdown">
                  <button className="nav-link text-white dropdown-toggle fs-6" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    Sản Phẩm
                  </button>
                  <ul className="dropdown-menu">
                    {type.map((i) => {
                      const slug = toSlug(i.name || i);
                      return (
                        <li key={i.id || slug}>
                          <a href={`/product-type/${slug}`} className="dropdown-item fw-normal">{i.name || i}</a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
                <li className="nav-item"><a href="/about" className="nav-link text-white fs-6">Giới Thiệu</a></li>
                <li className="nav-item"><a href="/contact" className="nav-link text-white fs-6">Liên Hệ</a></li>
              </ul>
            </nav>

            <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
              <div className="search-bar input-group mb-2 mb-lg-0 me-lg-3">
                <input
                  type="text"
                  className="form-control text-black border-0"
                  style={{ width: "250px" }}
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  className="btn bg-primary text-white"
                  onClick={() => handleSearch(searchTerm)}
                >
                  <i className="bi bi-search" style={{ pointerEvents: "none" }}></i>
                </button>

                {suggestions && suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((product) => (
                      <li key={product._id} onClick={() => handleSearch(product.name)}>
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <a href="/cart" className="nav-link text-white me-lg-3 position-relative">
                <i className="bi bi-cart-fill"></i>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill">
                    {cartCount}
                  </span>
                )}
              </a>

              {!!user ? (
                <div className="dropdown">
                  <button
                    className="nav-link text-white dropdown-toggle fw-bold"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Chào, <span className="text-warning text-uppercase">{user.name}</span>
                  </button>
                  <ul className="dropdown-menu">
                    <li><a href="/account" className="dropdown-item fw-medium">Thông tin tài khoản</a></li>
                    <li><button className="dropdown-item text-danger" onClick={logout}>Đăng xuất</button></li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex flex-column flex-lg-row">
                  <button className="nav-link text-white text-decoration-none fw-bold me-lg-2" onClick={() => setShowLogin(true)}>Đăng Nhập</button>
                  <button className="nav-link text-white text-decoration-none fw-bold" onClick={() => setShowRegister(true)}>Đăng Ký</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginModal show={showLogin} setShow={setShowLogin} setShowRegister={setShowRegister} />
      <RegisterModal show={showRegister} setShow={setShowRegister} setShowLogin={setShowLogin} />
    </header>
  );
};

export default Header;