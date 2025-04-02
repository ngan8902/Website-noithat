import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ProductImage from "../components/productdetail/ProductImage";
import QuantitySelector from "../components/productdetail/QuantitySelector";
import CustomerReviews from "../components/productdetail/CustomerReviews";
import useProductStore from "../store/productStore";
import { notifyOfCart } from "../constants/notify.constant";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";

const ProductDetail = () => {
    const { id } = useParams();
    const { products } = useProductStore();
    const { user } = useAuthStore();
    const { addToCart: addToCartStore, fetchCart } = useCartStore();
    const product = products.find(p => p._id === id);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();


    if (!product) {
        return <h2 className="text-center text-danger mt-5">Sản phẩm không tồn tại!</h2>;
    }

    const discountedPrice = product?.discount
        ? product?.price - (product?.price * product?.discount / 100)
        : product?.price;

    const increaseQuantity = () => {
        if (quantity < product.countInStock) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleBuyNow = () => {
        navigate("/checkout", {
            state: {
                product: {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    discount: product.discount || 0,
                    image: `http://localhost:8000${product.image}` ,
                    countInStock: product.countInStock
                },
                quantity
            },
        });
    };


    const addToCart = () => {
        if (user) {
            handleAddToCartForCustomer();
        } else {
            handleAddToCartForGuest();
        }
    };

    const handleAddToCartForGuest = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find(item => item._id === product._id);

        if (existingProduct) {
            const newQuantity = existingProduct.quantity + quantity;

            if (newQuantity > product.countInStock) {
                toast.error(`Số lượng tồn kho chỉ còn ${product.countInStock} sản phẩm.`);
                return;
            }
            existingProduct.quantity = newQuantity;
        } else {
            if (quantity > product.countInStock) {
                toast.error(`Số lượng tồn kho chỉ còn ${product.countInStock} sản phẩm.`);
                return;
            }
            cart.push({ ...product, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        window.dispatchEvent(new Event("cartUpdated"));

        notifyOfCart()
    }

    const handleAddToCartForCustomer = async () => {
        const res = await addToCartStore(product, quantity);
        if (res && res?.data && res?.data?.cart) {
            notifyOfCart()
            await fetchCart();
        }
    }

    return (
        <section className="py-5">
            <div className="container">
                <div className="row">
                    <ProductImage image={`http://localhost:8000/upload/${product.image.split("/").pop()}` } name={product?.name} />
                    <div className="col-md-6">
                        <h3 className="fw-bold mb-3">{product?.name}</h3>
                        <p className="text-muted mb-4">{product?.descriptionDetail}</p>

                        {product?.discount > 0 ? (
                            <div>
                                <p className="text-decoration-line-through text-muted mb-1">
                                    Giá gốc: {product?.price.toLocaleString()} VND
                                </p>
                                <p className="text-danger fw-bold">
                                    Giá khuyến mãi: {discountedPrice.toLocaleString()} VND ({product.discount}% OFF)
                                </p>
                            </div>
                        ) : (
                            <p className="fw-bold mb-4">Giá: {product?.price.toLocaleString()} VND</p>
                        )}

                        <h5 className="fw-bold mb-3">Thông Tin Chi Tiết</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><strong>Xuất xứ:</strong> {product?.origin || "Không xác định"}</li>
                            <li className="mb-2"><strong>Chất liệu:</strong> {product?.material || "Không có thông tin"}</li>
                            <li className="mb-2"><strong>Kích thước:</strong> {product?.size || "Không có"}</li>
                            <li className="mb-2"><strong>Bảo hành:</strong> {product?.warranty || "Không có"}</li>
                        </ul>

                        <p className="me-3">
                            {product?.countInStock > 0 ? `Sản phẩm tồn: ${product?.countInStock}` : ""}
                        </p>

                        {product?.countInStock > 0 && (
                            <QuantitySelector
                                quantity={quantity}
                                increaseQuantity={increaseQuantity}
                                decreaseQuantity={decreaseQuantity}
                            />
                        )}

                        <div className="d-flex mb-4">
                            {product?.countInStock > 0 ? (
                                <>
                                    <button className="btn btn-dark me-3" onClick={addToCart}>🛒 Thêm Vào Giỏ Hàng</button>
                                    <button className="btn btn-primary" onClick={handleBuyNow}>Mua Ngay</button>
                                </>
                            ) : (
                                <p className="text-danger fw-bold">Sản phẩm đã bán hết</p>
                            )}
                        </div>

                        <CustomerReviews reviews={product?.reviews} />
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;
