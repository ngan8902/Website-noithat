import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useProductStore from "../../store/productStore";
import { UPLOAD_URL } from '../../constants/url.constant';

const FeaturedProducts = () => {
    const navigate = useNavigate();
    const { products, getProducts } = useProductStore();

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    const bestSellerProducts = products.filter(product => product.isBestSeller) || [];

    const itemsPerPage = 3;
    const totalProducts = bestSellerProducts.length;
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalProducts);
    }, [totalProducts]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalProducts) % totalProducts);
    };

    useEffect(() => {
        if (totalProducts > itemsPerPage) {
            const interval = setInterval(nextSlide, 4000);
            return () => clearInterval(interval);
        }
    }, [totalProducts, nextSlide]);

    const visibleProducts = totalProducts >= itemsPerPage
        ? [
            bestSellerProducts[currentIndex % totalProducts] || {},
            bestSellerProducts[(currentIndex + 1) % totalProducts] || {},
            bestSellerProducts[(currentIndex + 2) % totalProducts] || {}
        ]
        : bestSellerProducts;

    const getImageUrl = (image) => {
        if (!image) return "";
    
        if (image.includes("lh3.googleusercontent.com")) {
          return image;
        }
    
        if (image.includes("drive.google.com")) {
          const match = image.match(/id=([a-zA-Z0-9_-]+)/);
          const idFromViewLink = image.match(/\/d\/(.*?)\//);
          const id = match ? match[1] : idFromViewLink ? idFromViewLink[1] : null;
    
          if (id) {
            return `${process.env.REACT_APP_URL_BACKEND}/image/drive-image/${id}`;
          } else {
            console.error("Không thể lấy ID từ Google Drive link:", image);
          }
        }
    
        // Nếu là link https bình thường
        if (image.startsWith("https://")) {
          return image;
        }
    
        // Nếu là file local trên server
        return `${UPLOAD_URL}${image}`;
      };

    return (
        <section className="py-5">
            <div className="container">
                <h2 className="text-center fw-bold mb-5">Sản Phẩm Nổi Bật</h2>
                <div className="position-relative overflow-hidden">
                {totalProducts > itemsPerPage && (
                    <button
                    className="btn btn-dark d-none d-md-flex align-items-center justify-content-center shadow"
                    onClick={prevSlide}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "10px",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        border: "none",
                        color: "white",
                    }}
                    >
                    <i className="bi bi-chevron-compact-left" style={{ fontSize: "20px" }}></i>
                    </button>
                )}

                <div
                    className="d-flex flex-nowrap justify-content-start"
                    style={{
                    transition: "transform 0.5s ease-in-out",
                    transform: `translateX(0%)`,
                    overflowX: "auto",
                    scrollSnapType: "x mandatory"
                    }}
                >
                    {visibleProducts.map((product, index) =>
                    product && getImageUrl(product.image) ? (
                        <div
                        className="col-10 col-sm-6 col-md-4 flex-shrink-0"
                        key={index}
                        style={{
                            minWidth: `calc(100% / ${itemsPerPage})`,
                            maxWidth: "100%",
                            padding: "0 10px",
                            scrollSnapAlign: "start",
                        }}
                        onClick={() => navigate(`/product/${product._id}`)}
                        >
                        <div className="card h-100 shadow-sm">
                            <img
                            src={getImageUrl(product.image)}
                            className="card-img-top"
                            alt={product.name || "Sản phẩm"}
                            style={{
                                height: "300px",
                                objectFit: "cover",
                                width: "100%"
                            }}
                            />
                            <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{product.name || "Sản phẩm chưa có tên"}</h5>
                            <p className="card-text">{product.description || "Mô tả chưa có"}</p>
                            <button
                                className="btn btn-link text-decoration-none mt-auto"
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                Xem Chi Tiết
                            </button>
                            </div>
                        </div>
                        </div>
                    ) : null
                    )}
                </div>

                {totalProducts > itemsPerPage && (
                    <button
                    className="btn btn-dark d-none d-md-flex align-items-center justify-content-center shadow"
                    onClick={nextSlide}
                    style={{
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        border: "none",
                        color: "white",
                    }}
                    >
                    <i className="bi bi-chevron-compact-right" style={{ fontSize: "20px" }}></i>
                    </button>
                )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;