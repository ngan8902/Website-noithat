import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CustomerInfo from "../components/checkout/CustomerInfo";
import ProductInfo from "../components/checkout/ProductInfo";
import PaymentMethod from "../components/checkout/PaymentMethod";
import LoginModal from "../components/header/LoginModal";
import RegisterModal from "../components/header/RegisterModal";
import useAuthStore from '../store/authStore';
import useOrderStore from "../store/orderStore";
import useCartStore from "../store/cartStore";
import { notifyOfCheckout } from "../constants/notify.constant";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { TOKEN_KEY } from "../constants/authen.constant";
import { Modal, Button } from "react-bootstrap";
import { getCookie } from "../utils/cookie.util";
import { UPLOAD_URL } from '../constants/url.constant';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const { user } = useAuthStore();
    const { createOrder } = useOrderStore();
    const { fetchCart, cartItems, clearPurchasedItems } = useCartStore();

    const { product: initialProduct, quantity, selectedProducts } = location.state || {};
    const storedProducts = JSON.parse(localStorage.getItem("selectedProducts")) || [];
    const [cartData, setCartData] = useState(selectedProducts || storedProducts);
    const [product, setProduct] = useState(initialProduct || (cartData.length === 1 ? cartData[0] : null));

    console.log("Cart Data:", cartData);
    console.log("Product:", product);
    
    useEffect(() => {
        if (!product && selectedProducts?.length === 1) {
            setProduct(selectedProducts[0]);
        }
    }, [selectedProducts, product]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("selectedProducts")) || [];

        if (selectedProducts) {
            setCartData(selectedProducts);
            localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
        } else if (storedCart.length > 0) {
            setCartData(storedCart);
        } else if (cartItems.length > 0) {
            const items = cartItems.map((item) => ({
                quantity: item.quantity,
                ...item?.productId?.data
            }));
            setCartData(items);
            localStorage.setItem("selectedProducts", JSON.stringify(items));
        }
    }, [selectedProducts, cartItems]);

    const savedAddresses = [{ id: 1, address: "" }];
    const hasAddress = savedAddresses.length > 0;

    const [selectedAddress, setSelectedAddress] = useState(hasAddress ? savedAddresses[0].address : "");
    const [newAddress, setNewAddress] = useState("");
    const [shippingFee, setShippingFee] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [info, setInfo] = useState('');
    const [receiver, setReceiver] = useState({ fullname: "", phone: "", address: "" });

    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const [, setFinalPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);


    const displayProducts = selectedProducts?.length > 0
        ? selectedProducts
        : (product ? [{ ...product, quantity }] : cartData);

    const calculateFinalPrice = () => {
        const totalProductPrice = displayProducts.reduce((total, item) => {
            const price = item.productId?.data?.price || item.price || item.product?.price || 0;
            const discount = item.productId?.data?.discount || item.discount || item.product?.discount || 0;
            const finalItemPrice = discount ? price - (price * discount) / 100 : price;
            return total + (finalItemPrice * (item.quantity || selectedProducts?.reduce((acc, item) => acc + item.quantity, 0)));
        }, 0);

        return totalProductPrice;
    };

    const calculateTotalPrice = () => {
        return calculateFinalPrice() + shippingFee;
    };

    useEffect(() => {
        setFinalPrice(calculateFinalPrice());
        setTotalPrice(calculateTotalPrice());
    }, [cartData, shippingFee]);

    useEffect(() => {
        const fetchAddress = async () => {
            if (user && user._id) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/user/get-details/${user._id}`, {
                        headers: {
                            'token': getCookie(TOKEN_KEY)
                        }
                    });
                    setInfo(response.data.data);
                } catch (error) {
                    console.error('Lỗi lấy địa chỉ:', error);
                }
            }
        };

        fetchAddress();
    }, [user]);

    useEffect(() => {
        const handleUserCart = async () => {
            if (user) {
                await fetchCart();
            } else {
                const localCart = JSON.parse(localStorage.getItem("cart")) || [];
                setCartData(localCart);
            }
        };

        handleUserCart();
    }, [user]);

    useEffect(() => {
        if (selectedProducts) {
            setCartData(selectedProducts);
        } else if (user && cartItems.length > 0) {
            setCartData(
                cartItems.map((item) => ({
                    quantity: item.quantity,
                    ...item?.productId?.data,
                }))
            );
        }
    }, [cartItems, selectedProducts, user]);

    useEffect(() => {
        if (!selectedProducts && cartItems.length > 0) {
            const items = cartItems.map((item) => {
                if (!item.productId) return { ...item };
                return {
                    quantity: item.quantity,
                    ...item?.productId?.data
                }
            });
            setCartData(items);
        }
    }, [cartItems, selectedProducts]);

    useEffect(() => {
        setShippingFee(calculateShippingFee(selectedAddress || newAddress));
    }, [selectedAddress, newAddress]);

    const calculateShippingFee = (address) => {
        if (!address) return 0;
        const lowerAddress = address.toLowerCase();

        if (lowerAddress.includes("gò vấp")) return 0;
        if (lowerAddress.includes("hồ chí minh")) return 50000;

        // Vùng I: Các tỉnh miền Nam từ Bình Định trở vào
        const regionI = ["bình định", "đồng nai", "bình dương", "cần thơ", "vũng tàu", "long an"];
        if (regionI.some(province => lowerAddress.includes(province))) return 80000;

        // Vùng II: Từ Quảng Ngãi ra Quảng Bình
        const regionII = ["quảng ngãi", "quảng nam", "huế", "quảng trị", "quảng bình"];
        if (regionII.some(province => lowerAddress.includes(province))) return 150000;

        // Vùng III: Miền Bắc từ Hà Tĩnh trở ra
        return 200000;
    };

    if (!product && (!cartData || cartData.length === 0)) {
        return <p className="text-center mt-5">Không có sản phẩm để thanh toán!</p>;
    }

    const orderDate = new Date().toLocaleDateString("vi-VN");

    const calculateDeliveredDate = (address) => {
        const now = new Date();
        const lowerAddress = (address || "").toLowerCase();

        // Khu vực nội thành TP.HCM hoặc các tỉnh miền Nam gần
        const innerCityKeywords = ["hồ chí minh", "gò vấp", "bình dương", "đồng nai", "cần thơ", "vũng tàu", "long an", "bình định"];
        const isInnerCity = innerCityKeywords.some(keyword => lowerAddress.includes(keyword));

        // Giao hàng sau 3-5 ngày cho nội thành, 5-7 ngày cho tỉnh xa
        const daysToAdd = isInnerCity ? 4 : 6;

        const deliveredDate = new Date(now.setDate(now.getDate() + daysToAdd));
        return deliveredDate.toLocaleDateString("vi-VN");
    };

    const delivered = calculateDeliveredDate(selectedAddress || newAddress);

    const handleCheckout = async () => {
        setShowConfirmModal(false);

        const formattedPaymentMethod = paymentMethod === "Thanh Toán Khi Nhận Hàng" ? "COD" :
            paymentMethod === "Chuyển Khoản Ngân Hàng" ? "VietQR" :
                paymentMethod === "MoMo" ? "MoMo" : null;

        if (!formattedPaymentMethod) {
            setErrorMessage("Phương thức thanh toán không hợp lệ!");
            return;
        }
        if (!selectedAddress && !newAddress) {
            setErrorMessage("Vui lòng chọn địa chỉ trước khi thanh toán!");
            return;
        }
        if (!paymentMethod) {
            setErrorMessage("Vui lòng chọn phương thức thanh toán!");
            return;
        }

        if (paymentMethod === "Chuyển Khoản Ngân Hàng") {
            try {
                const orderData = {
                    userId: user ? user._id : null,
                    productId: product
                        ? product.productId || product._id
                        : cartData.map((item) => item?.productId || item?.product?._id || item?._id),
                    amount: product ? (product.quantity || quantity) : cartData.map((item) => item.quantity),
                    orderItems: product
                        ? [{
                            product: product.productId || product._id,
                            name: product.name || product.name,
                            image: `${UPLOAD_URL}${product.image}` || product.image,
                            amount: product.quantity || quantity,
                            price: product.productId?.data?.price || product.price,
                            discount: product.productId?.data?.discount || product.discount
                        }]
                        : cartData.map(item => ({
                            product: item?.productId || item?.product?._id || item?._id,
                            name: item.productId?.data?.name || item.product?.name || item.name,
                            image: `${UPLOAD_URL}${item.image}` || item.image,
                            amount: item.quantity,
                            price: item.productId?.data?.price || item.product?.price || item.price,
                            discount: item.productId?.data?.discount || item.product?.discount || item.discount
                        })),
                    receiver: {
                        fullname: receiver?.fullname,
                        phone: receiver?.phone,
                        address: newAddress || selectedAddress
                    },
                    shoppingFee: shippingFee,
                    totalPrice: totalPrice,
                    paymentMethod: formattedPaymentMethod,
                    status: "pending",
                    orderDate: orderDate,
                    delivered: delivered,
                };

                const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/payos/create-payment-link`, {
                    amount: totalPrice,
                    description: paymentMethod,
                    orderCode: parseInt(Date.now().toString().slice(-3) + Math.floor(1000 + Math.random() * 9000)),
                    buyerName: orderData.receiver?.fullname,
                    buyerPhone: orderData.receiver?.phone,
                    buyerAddress: orderData.receiver?.address,
                    // items: [{
                    //     name: orderData.orderItems[0].name,
                    //     quantity: orderData.orderItems[0].amount,
                    //     price: (orderData.orderItems[0].price - (orderData.orderItems[0].price * orderData.orderItems[0].discount) / 100) * orderData.orderItems[0].amount,
                    // }],
                    tempOrderData: orderData,
                    user: orderData.userId
                });
                if (response.data?.paymentLinkId) {
                    localStorage.setItem('paymentLinkId', response.data.paymentLinkId);

                    if (user && newAddress) {
                        try {
                            await axios.post(`${process.env.REACT_APP_URL_BACKEND}/address/save-new-address`, {
                                userId: user._id,
                                address: newAddress,
                                fullname: receiver.fullname,
                                phone: receiver.phone,
                            });
                            console.log("Đã lưu địa chỉ sau khi đặt hàng thành công!");
                        } catch (error) {
                            console.error("Lỗi khi lưu địa chỉ:", error);
                        }
                    }

                    const purchasedItems = cartData?.map((item) => item._id) || [];
                    if (purchasedItems.length > 0) {
                        clearPurchasedItems(purchasedItems);
                        localStorage.removeItem("selectedProducts");
                    } else {
                        console.log("Không có sản phẩm nào để xóa.");
                    }

                    window.location.href = response.data.checkoutUrl;
                } else {
                    console.error("Không có paymentLinkId từ PayOS:", response.data);
                }
            } catch (error) {
                console.error("Lỗi khi thanh toán PayOS:", error);
                return;
            }
            return;
        }

        setErrorMessage("");

        const orderData = {
            userId: user ? user._id : null,
            productId: product
                ? product.productId || product._id
                : cartData.map((item) => item?.productId || item?.product?._id || item?._id),
            amount: product ? (product.quantity || quantity) : cartData.map((item) => item.quantity),
            orderItems: product
                ? [{
                    product: product.productId || product._id,
                    name: product.productId?.data?.name || product.name,
                    image: `${UPLOAD_URL}${product.image}` || product.image,
                    amount: product.quantity || quantity,
                    price: product.productId?.data?.price || product.price,
                    discount: product.productId?.data?.discount || product.discount
                }]
                : cartData.map(item => ({
                    product: item?.productId || item.product?._id || item?._id,
                    name: item.productId?.data?.name || item.product?.name || item.name,
                    image: `${UPLOAD_URL}${item.image}` || item.image,
                    amount: item.quantity,
                    price: item.productId?.data?.price || item.product?.price || item.price,
                    discount: item.productId?.data?.discount || item.product?.discount || item.discount
                })),
            receiver: {
                fullname: receiver?.fullname,
                phone: receiver?.phone,
                address: newAddress || selectedAddress
            },
            shoppingFee: shippingFee,
            totalPrice: totalPrice,
            paymentMethod: formattedPaymentMethod,
            status: "pending",
            orderDate: orderDate,
            delivered: delivered
        };

        try {
            const headers = user?.token ? { Authorization: TOKEN_KEY } : {};
            const response = await createOrder(orderData, { headers });

            if (!user && response?.data?.data?.orderCode) {
                const orderCode = response.data.data.orderCode;
                const existingCodes = JSON.parse(localStorage.getItem("guestOrderCodes")) || [];

                if (!existingCodes.includes(orderCode)) {
                    existingCodes.push(orderCode);
                    localStorage.setItem("guestOrderCodes", JSON.stringify(existingCodes));
                }
            }

            notifyOfCheckout()

            if (user && newAddress) {
                try {
                    await axios.post(`${process.env.REACT_APP_URL_BACKEND}/address/save-new-address`, {
                        userId: user._id,
                        address: newAddress,
                        fullname: receiver.fullname,
                        phone: receiver.phone,
                    });
                    console.log("Đã lưu địa chỉ sau khi đặt hàng thành công!");
                } catch (error) {
                    console.error("Lỗi khi lưu địa chỉ:", error);
                }
            }

            const purchasedItems = cartData?.map((item) => item._id) || [];

            if (purchasedItems.length > 0) {
                clearPurchasedItems(purchasedItems);
                localStorage.removeItem("selectedProducts");
            } else {
                console.log("Không có sản phẩm nào để xóa.");
            }

            setTimeout(async () => {
                await fetchCart();
                if (user) {
                    window.location.replace("/account");
                } else {
                    navigate("/guest-order");
                }
            }, 2000);
        } catch (error) {
            console.log(error)
            toast.error("Lỗi khi đặt hàng, vui lòng thử lại!");
        }
    };


    const getImageUrl = (item, product) => {
        const resolveImageUrl = (image) => {
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
                    return "";
                }
            }

            if (image.startsWith("http")) {
                return image;
            }

            return `${UPLOAD_URL}${image}`;
        };

        if (item?.image) {
            const url = resolveImageUrl(item.image);
            if (url) return url;
        }

        if (item?.productId?.data?.image) {
            const url = resolveImageUrl(item.productId.data.image);
            if (url) return url;
        }

        if (item?.product?.image) {
            const url = resolveImageUrl(item.product.image);
            if (url) return url;
        }

        if (product?.image) {
            const url = resolveImageUrl(product.image);
            if (url) return url;
        }

        return "https://via.placeholder.com/100";
    };


    return (
        <div className="container py-5">
            <h2 className="text-center fw-bold mb-5">Thông Tin Đơn Hàng</h2>
            <div className="row">
                <CustomerInfo
                    hasAddress={savedAddresses.length > 0}
                    savedAddresses={savedAddresses}
                    selectedAddress={selectedAddress}
                    setSelectedAddress={setSelectedAddress}
                    newAddress={newAddress}
                    setNewAddress={setNewAddress}
                    receiver={receiver}
                    setReceiver={setReceiver}
                    info={info}
                />
                <div className="col-md-6">
                    <ProductInfo
                        product={product}
                        quantity={quantity || selectedProducts?.reduce((acc, item) => acc + item.quantity, 0)}
                        cart={cartData}
                        shippingFee={shippingFee}
                        totalPrice={totalPrice}
                        selectedProducts={selectedProducts}
                    />
                    <PaymentMethod
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />

                    {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>}

                    {!user && (
                        <>
                            <p>Chúng tôi muốn hỗ trợ bạn tốt hơn. Hãy
                                <button
                                    className="btn btn-outline-primary text-dark text-decoration-none fw-bold"
                                    onClick={() => setShowRegister(true)}
                                >
                                    Đăng Ký
                                </button>ngay!
                            </p>
                        </>
                    )}

                    <button
                        className="btn btn-dark w-100 mt-4"
                        onClick={() => setShowConfirmModal(true)}
                        disabled={!selectedAddress && !newAddress}
                    >
                        Xác Nhận Mua Hàng
                    </button>
                </div>
                <ToastContainer />
            </div>
            <LoginModal show={showLogin} setShow={setShowLogin} setShowRegister={setShowRegister} />
            <RegisterModal show={showRegister} setShow={setShowRegister} setShowLogin={setShowLogin} />

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác Nhận Đơn Hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Tên khách hàng:</strong> {receiver?.fullname || user?.name}</p>
                    <p><strong>Số điện thoại:</strong> {receiver?.phone || user?.phone}</p>
                    <p><strong>Địa chỉ giao hàng:</strong> {selectedAddress || newAddress}</p>
                    <p><strong>Phương thức thanh toán:</strong> {paymentMethod}</p>
                    <p><strong>Ngày đặt hàng:</strong> {orderDate}</p>
                    <p><strong>Ngày giao dự kiến:</strong> {delivered}</p>

                    <h5 className="fw-bold mt-3">Sản phẩm:</h5>
                    {
                        displayProducts.map((item, index) => {
                            const productName = item.productId?.data?.name || item.name || item.product?.name;
                            const productPrice = item.productId?.data?.price || item.price || item.product?.price;
                            const discount = item.productId?.data?.discount || item.discount || item.product?.discount;
                            const hasDiscount = discount > 0;
                            return (
                                <div key={index} className="border p-2 mb-2">
                                    <p><strong>{productName}</strong></p>
                                    <img
                                        src={getImageUrl(item, product)}
                                        alt={productName}
                                        className="img-fluid rounded mb-2"
                                        style={{ width: "100px" }}
                                    />
                                    <p>Số lượng: {item.quantity}</p>
                                    <p>
                                        {hasDiscount ? (
                                            <>
                                                Giá:
                                                <span style={{ textDecoration: "line-through", color: "red" }}>
                                                    {((productPrice) * item.quantity)?.toLocaleString()} VND
                                                </span>
                                                {" "} ➝{" "}
                                                <span>
                                                    {(
                                                        ((productPrice) -
                                                            ((productPrice) * (discount) / 100))
                                                        * item.quantity
                                                    )?.toLocaleString()} VND
                                                </span>
                                                {" "} (đã giảm {discount}%)
                                            </>
                                        ) : (
                                            <>
                                                Giá:
                                                <span>
                                                    {((productPrice) * item.quantity)?.toLocaleString()} VND
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            );
                        })
                    }
                    <p><strong>Phí Vận Chuyển:</strong> {shippingFee?.toLocaleString()} VND</p>
                    <p><strong>Tổng Thanh Toán:</strong> {totalPrice?.toLocaleString()} VND</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Hủy
                    </Button>
                    <Button data-testid="confirm-checkout" variant="primary" onClick={handleCheckout}>
                        Xác Nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Checkout;
