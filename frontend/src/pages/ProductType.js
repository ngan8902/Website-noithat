import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import SidebarFilter from "../components/product/SidebarFilter";
import { Link, useParams } from "react-router-dom";
import useProductStore from "../store/productStore";
import Pagination from "../components/product/Pagination";
import { UPLOAD_URL } from '../constants/url.constant';

const defaultImage = "https://via.placeholder.com/300";
const PAGE = 6;

const ProductType = () => {
    const { productByType: products, getProductByType } = useProductStore();
    const { id } = useParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({ priceRange: "", rating: "" });
    const [, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getProductByType(id);
            setLoading(false);
        };

        fetchData();
        setCurrentPage(1);
    }, [getProductByType, id]);

    const applyFilters = (products) => {
        return products.filter((product) => {
            const finalPrice = product.discount
                ? product.price - (product.price * product.discount / 100)
                : product.price;

            const priceFilterPassed = !filters.priceRange || checkPriceFilter(finalPrice, filters.priceRange);
            const ratingFilterPassed = !filters.rating || checkRatingFilter(product.rating, filters.rating);

            return priceFilterPassed && ratingFilterPassed;
        });
    };

    const checkPriceFilter = (price, priceRange) => {
        switch (priceRange) {
            case "1": return price < 5000000;
            case "2": return price >= 5000000 && price <= 10000000;
            case "3": return price >= 10000000 && price <= 15000000;
            case "4": return price > 15000000;
            default: return true;
        }
    };

    const checkRatingFilter = (productRating, filterRating) => {
        const ratingFilter = parseInt(filterRating);
        return productRating && (
            (ratingFilter === 5 && productRating === 5) ||
            (ratingFilter === 4 && productRating >= 4 && productRating < 5) ||
            (ratingFilter === 3 && productRating >= 3 && productRating < 4)
        );
    };

    const filteredProducts = applyFilters(products);
    const sortedProducts = filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    const totalPages = Math.ceil(sortedProducts.length / PAGE);
    const paginatedProducts = sortedProducts.slice((currentPage - 1) * PAGE, currentPage * PAGE);

    const renderRatingStars = (rating) => {
        return [...Array(5)].map((_, index) => {
            if (index < Math.floor(rating)) {
                return <i key={index} className="bi bi-star-fill text-warning"></i>;
            } else if (index < rating) {
                return <i key={index} className="bi bi-star-half text-warning"></i>;
            } else {
                return <i key={index} className="bi bi-star text-secondary"></i>;
            }
        });
    };

    return (
        <div>
            <HeroSection title={products.length > 0 ? products[0].type : <span className="dots"></span>} background="/images/banner3.png" />
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">
                        {products.length > 0 ? `Các Sản Phẩm ${products[0].type}` : <span className="dots"></span>}
                    </h2>
                    <div className="row">
                        <SidebarFilter onFilterApply={setFilters} />
                        <div className="col-md-9">
                            <div className="position-relative">
                                <div className="row g-4 justify-content-left">
                                    {paginatedProducts.length > 0 ? (
                                        paginatedProducts.map((product) => {
                                            const finalPrice = product.discount
                                                ? product.price - (product.price * product.discount / 100)
                                                : product.price;

                                            return (
                                                <div 
                                                    className="col-md-4" key={product._id || product.id}
                                                    onClick={() => window.location.href = `/${encodeURIComponent(product.name)}/${product._id}`}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <div className="card h-100 text-center">
                                                        <img src={`${UPLOAD_URL}/upload/${product.image.split("/").pop()}` || defaultImage} className="card-img-top" alt={product.name} />
                                                        <div className="card-body d-flex flex-column">
                                                            <h5 className="card-title">{product.name}</h5>
                                                            <p className="card-text">{product.description}</p>
                                                            {product.discount > 0 ? (
                                                                <div>
                                                                    <p className="text-decoration-line-through text-muted">Giá gốc: {product.price.toLocaleString()} VND</p>
                                                                    <p className="text-danger fw-bold">Giá khuyến mãi: {finalPrice.toLocaleString()} VND ({product.discount}% OFF)</p>
                                                                </div>
                                                            ) : (
                                                                <p className="fw-bold">Giá: {product.price.toLocaleString()} VND</p>
                                                            )}
                                                            <div className="rating">
                                                                {product.rating ? renderRatingStars(product.rating) : renderRatingStars(0)}
                                                            </div>
                                                            <Link to={`/${encodeURIComponent(product.name)}/${product._id}`} className="btn btn-dark w-100 mt-auto">Xem Chi Tiết</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-muted">Không có sản phẩm nào phù hợp với bộ lọc.</p>
                                    )}
                                </div>
                                {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductType;