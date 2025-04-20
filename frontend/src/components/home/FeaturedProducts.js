import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useProductStore from "../../store/productStore";

const FeaturedProducts = () => {
    const navigate = useNavigate();
    const { products, getProducts } = useProductStore();
    console.log(products);
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

    return (
        <section className="py-5">
            <div className="container">
                <h2 className="text-center fw-bold mb-5">Sản Phẩm Nổi Bật</h2>
                <div className="position-relative overflow-hidden">

                    {totalProducts > itemsPerPage && (
                        <button
                            className="btn btn-dark d-flex align-items-center justify-content-center shadow"
                            onClick={prevSlide}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                                zIndex: 10,
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(0, 0, 0, 0.6)",
                                border: "none",
                                color: "white",
                                transition: "background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.6)"}
                        >
                            <i className="bi bi-chevron-compact-left" style={{ fontSize: "24px" }}></i>
                        </button>
                    )}

                    <div
                        className="d-flex justify-content-center"
                        style={{
                            transition: "transform 0.5s ease-in-out",
                            transform: `translateX(0%)`
                        }}
                    >
                        {visibleProducts.map((product, index) =>
                            product && `http://localhost:8000${product.image}` ? (
                                <div
                                    className="col-md-4 flex-shrink-0"
                                    key={index}
                                    style={{
                                        minWidth: `calc(100% / ${itemsPerPage})`,
                                        padding: "0 10px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => navigate(`/product/${product._id}`)} 
                                >
                                    <div className="card h-100 shadow-sm">
                                        <img
                                            src={`http://localhost:8000${product.image}`}
                                            className="card-img-top"
                                            alt={product.name || "Sản phẩm"}
                                            style={{
                                                height: "400px",
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

                        {totalProducts > itemsPerPage && (
                            <button
                                className="btn btn-dark d-flex align-items-center justify-content-center shadow"
                                onClick={nextSlide}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "10px",
                                    transform: "translateY(-50%)",
                                    zIndex: 10,
                                    width: "45px",
                                    height: "45px",
                                    borderRadius: "50%",
                                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                                    border: "none",
                                    color: "white",
                                    transition: "background-color 0.3s ease",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.6)"}
                            >
                                <i className="bi bi-chevron-compact-right" style={{ fontSize: "24px" }}></i>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;