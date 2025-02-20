import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useProductStore from "../../store/productStore";

const ProductList = ({  title }) => {
    const [startIndex, setStartIndex] = useState(0); // Vị trí bắt đầu hiển thị
    const { products, getProducts } = useProductStore(); // Lấy dữ liệu từ Zustand

    useEffect(() => {
        getProducts(); // Gọi API khi component mount
    }, [getProducts]);

    const visibleProducts = products.slice(startIndex, startIndex + 3); // Hiển thị 3 sản phẩm

    const nextProduct = () => {
        setStartIndex((prevIndex) => 
            prevIndex + 3 < products.length ? prevIndex + 3 : 0
        );
    };

    const prevProduct = () => {
        setStartIndex((prevIndex) => 
            prevIndex - 3 >= 0 ? prevIndex - 3 : Math.max(products.length - 3, 0)
        );
    };

    return (
        <div>
            <h3 className="fw-bold mb-4 text-center">{title}</h3>
            <div className="position-relative">
                {/* Mũi tên trái */}
                {products.length > 3 && (
                    <button 
                        className="btn btn-outline-dark bg-dark-subtle position-absolute start-0 top-50 translate-middle-y" 
                        style={{ zIndex: 10 }} 
                        onClick={prevProduct}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </button>
                )}

                {/* Danh sách sản phẩm */}
                <div className="row g-4 justify-content-center">
                    {visibleProducts.map((product) => {
                        const finalPrice = product.discount
                            ? product.price - (product.price * product.discount / 100)
                            : product.price;
                        
                        return (
                            <div className="col-md-4" key={product.id}>
                                <div className="card h-100 text-center">
                                    <img 
                                        src={product.image || "https://via.placeholder.com/300"} 
                                        className="card-img-top" 
                                        alt={product.name} 
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">{product.description}</p>

                                        {/* Hiển thị giá trước và sau khi giảm */}
                                        {product.discount > 0 ? (
                                            <div>
                                                <p className="text-decoration-line-through text-muted">
                                                    Giá gốc: {product.price.toLocaleString()} VND
                                                </p>
                                                <p className="text-danger fw-bold">
                                                    Giá khuyến mãi: {finalPrice.toLocaleString()} VND ({product.discount}% OFF)
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="fw-bold">Giá: {product.price.toLocaleString()} VND</p>
                                        )}

                                        {/* Điều hướng đến trang chi tiết sản phẩm */}
                                        <Link to={`/${product.name}/${product._id}`} className="btn btn-dark w-100">
                                            Xem Chi Tiết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mũi tên phải */}
                {products.length > 3 && (
                    <button 
                        className="btn btn-outline-dark bg-dark-subtle position-absolute end-0 top-50 translate-middle-y" 
                        style={{ zIndex: 10 }} 
                        onClick={nextProduct}
                    >
                        <i className="bi bi-arrow-right"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductList;