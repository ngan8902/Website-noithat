import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import SidebarFilter from "../components/product/SidebarFilter";
import { Link } from "react-router-dom";
import useProductStore from "../store/productStore";
import { useParams } from "react-router-dom";
import Pagination from "../components/product/Pagination";

const defaultImage = "https://via.placeholder.com/300";
const PAGE = 9;

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
        return products.filter(product => {
            const finalPrice = product.discount
                ? product.price - (product.price * product.discount / 100)
                : product.price;

            // Lọc theo khoảng giá
            if (filters.priceRange) {
                switch (filters.priceRange) {
                    case "1":
                        if (finalPrice >= 5000000) return false;
                        break;
                    case "2":
                        if (finalPrice < 5000000 || finalPrice > 10000000) return false;
                        break;
                    case "3":
                        if (finalPrice < 10000000 || finalPrice > 15000000) return false;
                        break;
                    case "4":
                        if (finalPrice <= 15000000) return false;
                        break;
                    default:
                        break;
                }
            }

            // Lọc theo đánh giá
            if (filters.rating && product.rating < parseInt(filters.rating)) {
                return false;
            }

            return true;
        });
    };

    const filteredProducts = applyFilters(products);
    const sortProducts = filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));

    const totalPages = Math.ceil(sortProducts.length / PAGE);

    const paginatProducts = sortProducts.slice(
        (currentPage - 1) * PAGE,
        currentPage * PAGE
    );

    return (
        <div>
            <HeroSection title={products.length > 0 ? products[0].type : <span className="dots"></span>} background="/images/banner3.png" />

            <section className="py-5">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">
                        {products.length > 0 ? "Các Sản Phẩm " + products[0].type : <span className="dots"></span>}
                    </h2>
                    <div className="row">
                        <SidebarFilter onFilterApply={setFilters} />

                        <div className="col-md-9">
                            <div className="position-relative">
                                <div className="row g-4 justify-content-left">
                                    {paginatProducts.map((product) => {
                                        const finalPrice = product.discount
                                            ? product.price - (product.price * product.discount / 100)
                                            : product.price;

                                        return (
                                            <div className="col-md-4" key={product._id || product.id}>
                                                <div className="card h-100 text-center">
                                                    <img
                                                        src={`http://localhost:8000/upload/${product.image.split("/").pop()}` || defaultImage}
                                                        className="card-img-top"
                                                        alt={product.name}
                                                    />
                                                    <div className="card-body d-flex flex-column">
                                                        <h5 className="card-title">{product.name}</h5>
                                                        <p className="card-text">{product.description}</p>

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

                                                        <div className="rating">
                                                            {[...Array(5)].map((_, index) => (
                                                                <i
                                                                    key={index}
                                                                    className={`bi ${index < product.rating ? "bi-star-fill text-warning" : "bi-star text-secondary"}`}
                                                                ></i>
                                                            ))}
                                                        </div>

                                                        <Link to={`/${encodeURIComponent(product.name)}/${product._id}`} className="btn btn-dark w-100 mt-auto">
                                                            Xem Chi Tiết
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {totalPages > 1 && (
                                    <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductType;
