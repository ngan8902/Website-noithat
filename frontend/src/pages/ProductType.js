import React, { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import SidebarFilter from "../components/product/SidebarFilter";
import { Link } from "react-router-dom";
import useProductStore from "../store/productStore";
import { useParams } from "react-router-dom";

const defaultImage = "https://via.placeholder.com/300";

const ProductType = () => {
    const { productByType: products, getProductByType } = useProductStore();

    const { id } = useParams();

    useEffect(() => {
        getProductByType(id);
    }, [getProductByType, id]);

    return (
        <div>
            <HeroSection title="Sofa" background="/assets/sofa/sofa.jpg" />

            <section className="py-5">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">Danh Mục Sofa</h2>
                    <div className="row">
                        <SidebarFilter />

                        <div className="col-md-9">
                            <div className="position-relative">
                                <div className="row g-4 justify-content-left">
                                    {products.map((product) => {
                                        const finalPrice = product.discount
                                            ? product.price - (product.price * product.discount / 100)
                                            : product.price;

                                        return (
                                            <div className="col-md-4" key={product._id || product.id}>
                                                <div className="card h-100 text-center">
                                                    <img
                                                        src={product.image || defaultImage}
                                                        className="card-img-top"
                                                        alt={product.name}
                                                    />
                                                    <div className="card-body">
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

                                                        <Link to={`/${encodeURIComponent(product.name)}/${product._id}`} className="btn btn-dark w-100">
                                                            Xem Chi Tiết
                                                        </Link>

                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductType;
