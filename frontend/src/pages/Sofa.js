import React from "react";
import HeroSection from "../components/HeroSection";
import SidebarFilter from "../components/product/SidebarFilter";
import ProductList from "../components/product/ProductList";

export const allProducts = [
    { 
        id: 1,
        name: "Sofa Sang Trọng", 
        description: "Một chiếc sofa đẳng cấp.", 
        price: 10000000, 
        discount: 20, 
        isBestSeller: true, 
        image: "/assets/sofa/sofa-1.jpg" 
    },
    { 
        id: 2, 
        name: "Sofa Hiện Đại", 
        description: "Thiết kế tinh tế.", 
        price: 8500000, 
        discount: 15, 
        isBestSeller: true, 
        image: "/assets/sofa/sofa-1.jpg" 
    },
    { 
        id: 3, 
        name: "Sofa Thư Giãn", 
        description: "Thoải mái sau ngày dài.", 
        price: 7200000, 
        discount: 10, 
        isBestSeller: false, 
        image: "/assets/sofa/sofa-1.jpg" 
    },
    { 
        id: 4, 
        name: "Sofa Hoàng Gia", 
        description: "Phong cách hoàng gia.", 
        price: 12000000, 
        discount: 30, 
        isBestSeller: true, 
        image: "/assets/sofa/sofa-1.jpg" 
    },
    { 
        id: 5, 
        name: "Sofa Da Cao Cấp", 
        description: "Da thật 100%, bền bỉ.", 
        price: 15000000, 
        isBestSeller: true, 
        image: "/assets/sofa/sofa-1.jpg" 
    },
];

const discountedProducts = allProducts.filter(product => product.discount > 0);
const bestSellerProducts = allProducts.filter(product => product.isBestSeller);
const defaultImage = "https://via.placeholder.com/300";

const SofaPage = () => {
    return (
        <div>
            <HeroSection title="Sofa" background="/images/banner.png" />

            <section className="py-5">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">Sản Phẩm Sofa</h2>
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
