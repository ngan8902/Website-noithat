import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import useProductStore from "../store/productStore";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import { notifyOfCart } from "../constants/notify.constant";
import ProductImage from "../components/productdetail/ProductImage";
import QuantitySelector from "../components/productdetail/QuantitySelector";
import CustomerReviews from "../components/productdetail/CustomerReviews";
import Comments from "../components/Comments";
import { UPLOAD_URL } from '../constants/url.constant';

const avatarDefautl = `/images/guest.png`

const ProductDetail = () => {
    const { id } = useParams();
    const { products } = useProductStore();
    const { user } = useAuthStore();
    const { addToCart: addToCartStore, fetchCart } = useCartStore();
    const product = products.find((p) => p._id === id);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [errorComments, setErrorComments] = useState("");

    const fetchProductComments = useCallback(async () => {
        setLoadingComments(true);
        setErrorComments("");
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_URL_BACKEND}/comments/${id}/get-comments`
            );
            setComments(response.data.data);
            setLoadingComments(false);
        } catch (error) {
            console.error("Lỗi khi tải bình luận:", error);
            setErrorComments("Không thể tải bình luận.");
            setLoadingComments(false);
        }
    }, [id]);

    const handleCommentSubmitSuccess = useCallback(() => {
        setShowCommentForm(false);
        fetchProductComments();
    }, [fetchProductComments]);

    useEffect(() => {
        if (id) {
            fetchProductComments();
        }
    }, [id, fetchProductComments]);

    const discountedPrice = product?.discount ? product.price * (1 - product.discount / 100) : product?.price;

    const increaseQuantity = () => setQuantity((prev) => Math.min(prev + 1, product.countInStock));
    const decreaseQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

    const handleBuyNow = () => {
        navigate("/checkout", {
            state: { product: { ...product, image: `${UPLOAD_URL}${product.image}` }, quantity },
        });
    };

    const handleAddToCartForGuest = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProductIndex = cart.findIndex((item) => item._id === product._id);

        if (existingProductIndex > -1) {
            const updatedCart = [...cart];
            const newQuantity = updatedCart[existingProductIndex].quantity + quantity;
            if (newQuantity > product.countInStock) {
                toast.error(`Số lượng tồn kho chỉ còn ${product.countInStock} sản phẩm.`);
                return;
            }
            updatedCart[existingProductIndex].quantity = newQuantity;
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        } else {
            if (quantity > product.countInStock) {
                toast.error(`Số lượng tồn kho chỉ còn ${product.countInStock} sản phẩm.`);
                return;
            }
            localStorage.setItem("cart", JSON.stringify([...cart, { ...product, quantity }]));
        }
        window.dispatchEvent(new Event("cartUpdated"));
        notifyOfCart();
    };

    const handleAddToCartForCustomer = async () => {
        const res = await addToCartStore(product, quantity);
        if (res?.data?.cart) {
            notifyOfCart();
            await fetchCart();
        }
    };

    const addToCart = () => (user ? handleAddToCartForCustomer() : handleAddToCartForGuest());

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });

    const renderMedia = (mediaFiles) => (
        <div className="mt-2">
            {mediaFiles.map((file, index) => {
                const fileExtension = file.split(".").pop().toLowerCase();
                if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
                    return (
                        <img
                            key={index}
                            src={`${UPLOAD_URL}${file}`}
                            alt={`Bình luận ảnh ${index + 1}`}
                            className="img-fluid rounded me-2"
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                    );
                }
                if (["mp4", "mpeg", "ogg"].includes(fileExtension)) {
                    return (
                        <video
                            key={index}
                            src={`${UPLOAD_URL}${file}`}
                            controls
                            className="rounded me-2"
                            style={{ maxWidth: "200px", maxHeight: "150px" }}
                        />
                    );
                }
                return null;
            })}
        </div>
    );

    const getAvatarUrl = (avatar) => {
        if (!avatar) return "";

        if (avatar.includes("lh3.googleusercontent.com")) {
            return avatar;
        }

        if (avatar.includes("drive.google.com")) {
            const match = avatar.match(/id=([a-zA-Z0-9_-]+)/);
            const idFromViewLink = avatar.match(/\/d\/(.*?)\//);
            const id = match ? match[1] : idFromViewLink ? idFromViewLink[1] : null;

            if (id) {
                return `${process.env.REACT_APP_URL_BACKEND}/image/drive-image/${id}`;
            } else {
                console.error("Không thể lấy ID từ Google Drive link:", avatar);
            }
        }

        // Nếu là link https bình thường
        if (avatar.startsWith("https://")) {
            return avatar;
        }

        // Nếu là file local trên server
        return `${UPLOAD_URL}${avatar}`;
    };

    if (!product) {
        return <h3 className="container py-5 text-center fw-bold">Sản phẩm đang tải...</h3>;
    }

    const renderComments = () => {
        if (loadingComments) return <p>Đang tải bình luận...</p>;
        if (errorComments) return <p className="text-danger">{errorComments}</p>;
        if (comments.length === 0) return <p>Chưa có bình luận nào cho sản phẩm này.</p>;

        return (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {[...comments].reverse().map((comment) => (
                    <div key={comment._id} className="mb-3 border p-3 d-flex align-items-start">
                        <img
                            src={getAvatarUrl(comment.userId?.avatar, avatarDefautl)}
                            alt={comment.userId?.name || 'Khách'}
                            className="rounded-circle me-3"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div>
                            <div className="d-flex align-items-center mb-1">
                                <p className="fw-bold mb-0">{comment.userId?.name}</p>
                            </div>
                            <p className="text-muted small mb-1">{formatDate(comment.createdAt)}</p>
                            <p className="mb-1">{comment.content}</p>
                            {comment.mediaFile?.length > 0 && renderMedia(comment.mediaFile)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const getImageUrl = (image) => {
        if (!image) return "";

        if (image.includes("lh3.googleusercontent.com")) {
            return image;
        }

        if (image.includes("drive.google.com")) {
            const match = image.match(/id=([a-zA-Z0-9_-]+)/);
            const idFromViewLink = image.match(/\/d\/(.*?)\//);
            const id = match ? match[1] : idFromViewLink ? idFromViewLink[1] : null;

            if (id) {
                return `${process.env.REACT_APP_URL_BACKEND}/image/drive-image/${id}`;
            } else {
                console.error("Không thể lấy ID từ Google Drive link:", image);
            }
        }

        // Nếu là link https bình thường
        if (image.startsWith("https://")) {
            return image;
        }

        // Nếu là file local trên server
        return `${UPLOAD_URL}${image}`;
    };


    return (
        <section className="py-5">
            <div className="container">
                <div className="row">
                    <ProductImage image={getImageUrl(product?.image)} name={product?.name} />
                    <div className="col-md-6">
                        <h3 className="fw-bold mb-3">{product?.name}</h3>
                        <p className="text-muted mb-4">{product?.descriptionDetail}</p>

                        {product?.discount > 0 ? (
                            <div>
                                <p className="text-decoration-line-through text-muted mb-1">
                                    Giá gốc: {product?.price?.toLocaleString()} VND
                                </p>
                                <p className="text-danger fw-bold">
                                    Giá khuyến mãi: {discountedPrice?.toLocaleString()} VND ({product.discount}% OFF)
                                </p>
                            </div>
                        ) : (
                            <p className="fw-bold mb-4">Giá: {product?.price?.toLocaleString()} VND</p>
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
                                    <button className="btn btn-dark me-3" onClick={addToCart}>
                                        🛒 Thêm Vào Giỏ Hàng
                                    </button>
                                    <button className="btn btn-primary" onClick={handleBuyNow}>
                                        Mua Ngay
                                    </button>
                                </>
                            ) : (
                                <p className="text-danger fw-bold">Sản phẩm đã bán hết</p>
                            )}
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <CustomerReviews reviews={product.rating} />
                        </div>
                    </div>
                    {showCommentForm && (
                        <div className="mt-3">
                            <Comments onSubmitSuccess={handleCommentSubmitSuccess} />
                        </div>
                    )}
                    <div className="col-12 mt-4">
                        <h4 className="fw-bold mb-3">Bình Luận Của Khách Hàng</h4>
                        {renderComments()}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </section>
    );
};

export default ProductDetail;