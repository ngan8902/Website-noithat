import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useProductStore from "../../store/productStore";

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
            const interval = setInterval(nextSlide, 5000);
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
                            className="btn btn-outline-dark btn-secondary"
                            onClick={prevSlide}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                                zIndex: 10
                            }}
                        >
                            <i className="bi bi-chevron-compact-left"></i>
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
                        product && product.image ? (
                          <div 
                              className="col-md-4 flex-shrink-0"
                              key={index} 
                              style={{ 
                                  minWidth: `calc(100% / ${itemsPerPage})`,
                                  padding: "0 10px"
                              }}
                          >
                              <div className="card h-100 shadow-sm">
                                  <img 
                                    src={product.image} 
                                    className="card-img-top" 
                                    alt={product.name || "Sản phẩm"} 
                                    style={{ 
                                        height: "400px",
                                        objectFit: "cover",
                                        width: "100%"
                                    }}
                                  />
                                  <div className="card-body">
                                      <h5 className="card-title">{product.name || "Sản phẩm chưa có tên"}</h5>
                                      <p className="card-text">{product.description || "Mô tả chưa có"}</p>
                                      <button 
                                          className="btn btn-link text-decoration-none"
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
                            className="btn btn-outline-dark btn-secondary"
                            onClick={nextSlide}
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: "10px",
                                transform: "translateY(-50%)",
                                zIndex: 10
                            }}
                        >
                            <i className="bi bi-chevron-compact-right"></i>
                        </button>
                    )}
                    </div>
                </div>  
            </div>
        </section>
    );
};

export default FeaturedProducts;
