import React, { useState, useEffect } from "react";
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
import { Modal, Button } from "react-bootstrap"; // Thêm thư viện Bootstrap Modal

const Checkout = () => {
    const location = useLocation();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const { user } = useAuthStore();
    const { createOrder } = useOrderStore();
    const { fetchCart, cartItems, clearPurchasedItems } = useCartStore();

    const { product, quantity, selectedProducts } = location.state || {};
    const [cartData, setCartData] = useState(selectedProducts || []);

    const savedAddresses = [{ id: 1, address: "" }];
    const [, setSavedAddresses] = useState([]);
    const hasAddress = savedAddresses.length > 0;

    const [selectedAddress, setSelectedAddress] = useState(hasAddress ? savedAddresses[0].address : "");
    const [newAddress, setNewAddress] = useState("");
    const [shippingFee, setShippingFee] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [receiver, setReceiver] = useState({ fullname: "", phone: "", address: "" });

    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const handleUserAddress = () => {
            if (user) {
                axios.get(`${process.env.REACT_APP_URL_BACKEND}/address/get-address/${user._id}`)
                    .then(response => {
                        if (response.data.status === "SUCCESS") {
                            setSavedAddresses(response.data.data);
                            if (response.data.data.length > 0) {
                                setSelectedAddress(response.data.data[0].address);
                            }
                        }
                    })
                    .catch(error => {
                        console.error("Lỗi khi lấy danh sách địa chỉ:", error)
                    })
            }
        };

        if (user) {
            handleUserAddress();
            fetchCart();
        } else {
            const localCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCartData(localCart);
        }
    }, [user, fetchCart]);

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
        if (lowerAddress.includes("hồ chí minh")) return 50000;
        if (lowerAddress.includes("long an")) return 80000;
        if (lowerAddress.includes("hà nội")) return 200000;
        return 100000;
    }

    if (!product && (!cartData || cartData.length === 0)) {
        return <p className="text-center mt-5">Không có sản phẩm để thanh toán!</p>;
    }

    const handleCheckout = async () => {
        setShowConfirmModal(false);

        const formattedPaymentMethod = paymentMethod === "Thanh Toán Khi Nhận Hàng" ? "COD" :
            paymentMethod === "VnPay" ? "VNPAY" : null;

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
        setErrorMessage("");

        const orderData = {
            userId: user ? user._id : null,
            productId: product?._id || cartData.map((item) => item._id),
            amount: product?quantity : cartData.map((item) => item.quantity),
            orderItems: product
                ? [{
                    product: product._id,
                    name: product.name,
                    image: product.image,
                    amount: quantity,
                    price: product.price,
                }]
                : cartData.map(item => ({
                    product: item._id,
                    name: item.name,
                    image: item.image,
                    amount: item.quantity,
                    price: item.price,
                })),
            receiver: {
                fullname: receiver?.fullname,
                phone: receiver?.phone,
                address: newAddress || selectedAddress
            },
            itemsPrice: product?.price,
            totalPrice: (product?.price * product?.quantity)+ shippingFee,
            paymentMethod: formattedPaymentMethod,
            status: "pending"
        };
        try {
            const headers = user?.token ? { Authorization: TOKEN_KEY } : {};
            await createOrder(orderData, { headers });
            notifyOfCheckout()

            const purchasedItems = product
                ? [product._id]
                : (Array.isArray(cartData) && cartData.length > 0)
                    ? cartData.map((item) => item._id)
                    : [];

            if (purchasedItems.length > 0) {
                clearPurchasedItems(purchasedItems);
            } else {
                console.log("Không có sản phẩm nào để xóa.");
            }
            setTimeout(async () => {
                await fetchCart();
                // if (user) {
                //     window.location.replace("/account");
                // } else {
                //     window.location.replace("/home");
                // }
            }, 500);
        } catch (error) {
            console.log(error)
            toast.error("Lỗi khi đặt hàng, vui lòng thử lại!");
        }
    };

    const displayProducts = product
    ? [{ ...product, quantity }] 
    : cartData;

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
                />
                <div className="col-md-6">
                    <ProductInfo
                        cartItems={cartItems}
                        product={product}
                        quantity={quantity}
                        cart={cartData}
                        shippingFee={shippingFee}
                    />
                    <PaymentMethod
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />

                    {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>}

                    {!user && (
                        <>
                            <p>Bạn muốn nhận thông báo về các ưu đãi? Hãy
                                <button
                                    className="btn text-dark text-decoration-none fw-bold"
                                    onClick={() => setShowRegister(true)}
                                >
                                    Đăng Ký
                                </button> ngay!
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
                    <p><strong>Tên khách hàng:</strong> {receiver.fullname || user?.name}</p>
                    <p><strong>Số điện thoại:</strong> {receiver.phone || user?.phone}</p>
                    <p><strong>Địa chỉ giao hàng:</strong> {selectedAddress || newAddress}</p>
                    <p><strong>Phương thức thanh toán:</strong> {paymentMethod}</p>
                    <p><strong>Ngày đặt hàng:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Ngày giao dự kiến:</strong> {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    
                    <h5 className="fw-bold mt-3">Sản phẩm:</h5>
                    {cartData.map((item, index) => (
                        <div key={index} className="border p-2 mb-2">
                            <p><strong>{item.productId?.data.name}</strong></p>
                            <img src={item.productId?.data.image} alt={item.productId?.data.name} className="img-fluid rounded mb-2" style={{ width: "100px" }} />
                            <p>Số lượng: {item.quantity}</p>
                            <p>Giá: {(item.productId?.data.price * item.quantity).toLocaleString()} VND</p>
                        </div>
                    ))}

                    <p><strong>Phí Vận Chuyển:</strong> {shippingFee.toLocaleString()} VND</p>
                    <p><strong>Tổng Thanh Toán:</strong> {(displayProducts.reduce((total, item) => total + (item.productId?.data.price * item.quantity), 0) + shippingFee).toLocaleString()} VND</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleCheckout}>
                        Xác Nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        );
};

export default Checkout;
