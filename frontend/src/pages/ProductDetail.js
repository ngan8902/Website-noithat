import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProductImage from "../components/productdetail/ProductImage";
import QuantitySelector from "../components/productdetail/QuantitySelector";
import CustomerReviews from "../components/productdetail/CustomerReviews";
import useAuthStore from "../store/authStore";
import useProductStore from "../store/productStore";

const ProductDetail = () => {
    const { id } = useParams();
    const { products } = useProductStore();
    const product = products.find(p => p._id.toString() === id);
    const [quantity, setQuantity] = useState(1);
    const { user } = useAuthStore();
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const navigate = useNavigate();

    if (!product) {
        return <h2 className="text-center text-danger mt-5">Sản phẩm không tồn tại!</h2>;
    }

    const discountedPrice = product.discount
        ? product.price - (product.price * product.discount / 100)
        : product.price;

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

    const handleBuyNow = () => {
        if (!user) {
            setShowLoginAlert(true);
            return;
        }
        navigate("/checkout", { state: { product, quantity } });
    };

    const addToCart = () => {
        if (!user) {
            setShowLoginAlert(true);
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Đã thêm vào giỏ hàng!");
    };

    return (
        <section className="py-5">
            <div className="container">
                <div className="row">
                    <ProductImage image={product.image} name={product.name} />
                    <div className="col-md-6">
                        <h3 className="fw-bold mb-3">{product.name}</h3>
                        <p className="text-muted mb-4">{product.description}</p>

                        {product.discount > 0 ? (
                            <div>
                                <p className="text-decoration-line-through text-muted mb-1">
                                    Giá gốc: {product.price.toLocaleString()} VND
                                </p>
                                <p className="text-danger fw-bold">
                                    Giá khuyến mãi: {discountedPrice.toLocaleString()} VND ({product.discount}% OFF)
                                </p>
                            </div>
                        ) : (
                            <p className="fw-bold mb-4">Giá: {product.price.toLocaleString()} VND</p>
                        )}

                        <h5 className="fw-bold mb-3">Thông Tin Chi Tiết</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><strong>Xuất xứ:</strong> {product.origin || "Không xác định"}</li>
                            <li className="mb-2"><strong>Chất liệu:</strong> {product.material || "Không có thông tin"}</li>
                            <li className="mb-2"><strong>Kích thước:</strong> {product.size || "Không có"}</li>
                            <li className="mb-2"><strong>Bảo hành:</strong> {product.warranty || "Không có"}</li>
                        </ul>

                        <p className="me-3">Sản phẩm tồn: {product.quantity || "Không có thông tin"}</p>

                        <QuantitySelector 
                            quantity={quantity} 
                            increaseQuantity={increaseQuantity} 
                            decreaseQuantity={decreaseQuantity} 
                        />

                        {showLoginAlert && (
                            <div className="alert alert-warning mt-3" role="alert">
                                Bạn cần <strong>đăng nhập</strong> hoặc <strong>đăng ký</strong> để thực hiện thao tác này!
                            </div>
                        )}

                        <div className="d-flex mb-4">
                            <button className="btn btn-dark me-3" onClick={addToCart}>🛒 Thêm Vào Giỏ Hàng</button>
                            <button className="btn btn-primary" onClick={handleBuyNow}>Mua Ngay</button>
                        </div>

                        <CustomerReviews reviews={product.reviews} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;
