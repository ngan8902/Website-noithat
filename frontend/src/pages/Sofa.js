import React, { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import SidebarFilter from "../components/product/SidebarFilter";
import ProductList from "../components/product/ProductList";
import useProductStore from "../store/productStore";

const defaultImage = "https://via.placeholder.com/300";

const SofaPage = () => {
    const { products, getProducts } = useProductStore();

    useEffect(() => {
        getProducts(); 
    }, [getProducts]);

    const sofaProducts = products.filter(product => product.type.toLowerCase() === "sofa");

    const discountedSofaProducts = sofaProducts.filter(product => product.discount > 0);

    return (
        <div>
            <HeroSection title="Sofa" background="/images/banner.png" />

            <section className="py-5">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">Danh Mục Sofa</h2>
                    <div className="row">
                        <SidebarFilter />

                        <div className="col-md-9">
                            <ProductList 
                                products={discountedSofaProducts.map(product => ({
                                    ...product, 
                                    image: product.image || defaultImage
                                }))} 
                                title="Sản Phẩm Giảm Giá" 
                            />

                            <ProductList 
                                products={sofaProducts
                                    .filter(product => product.discount === 0)
                                    .map(product => ({
                                        ...product, 
                                        image: product.image || defaultImage
                                    }))} 
                                title="Các Sản Phẩm Sofa Khác" 
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SofaPage;
