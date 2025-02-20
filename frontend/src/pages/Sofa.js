import React, { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import SidebarFilter from "../components/product/SidebarFilter";
import ProductList from "../components/product/ProductList";
import useProductStore from "../store/productStore"; // Import Zustand Store



const defaultImage = "https://via.placeholder.com/300";

const SofaPage = () => {
    const { products, getProducts } = useProductStore(); // Lấy dữ liệu từ Zustand

    useEffect(() => {
        getProducts(); // Gọi API khi component mount
    }, [getProducts]);

    const discountedProducts = products.filter(product => product.discount > 0);
    const bestSellerProducts = products.filter(product => product.isBestSeller);

    return (
        <div>
            <HeroSection title="Sofa" background="/images/banner.png" />

            <section className="py-5">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">{products.name}</h2>
                    <div className="row">
                        <SidebarFilter />

                        <div className="col-md-9">
                            <ProductList 
                                products={discountedProducts.map(product => ({
                                    ...product, 
                                    image: product.image || defaultImage
                                }))} 
                                title="Sản Phẩm Giảm Giá" 
                            />
                            <ProductList 
                                products={bestSellerProducts.map(product => ({
                                    ...product, 
                                    image: product.image || defaultImage
                                }))} 
                                title="Sản Phẩm Bán Chạy" 
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SofaPage;
