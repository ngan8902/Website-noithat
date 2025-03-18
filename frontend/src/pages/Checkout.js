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

const Checkout = () => {
    const location = useLocation();
    const { user } = useAuthStore();
    const { createOrder } = useOrderStore();
    const { fetchCart, cartItems } = useCartStore();


    const { product, quantity, cart: cartState } = location.state || {};
    const [cartData, setCartData] = useState(cartState || []);

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
        if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
            const items = cartItems.map((item) => {
                if (!item.productId) return { ...item };
                return {
                    quantity: item.quantity,
                    ...item?.productId?.data
                }
            });
            setCartData(items);
        }
    }, [cartItems]);

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

    const getTotalPrice = () => {
        if (product) {
            return product.price * quantity;
        } else {
            const cartItems = user && user._id ? cartData : JSON.parse(localStorage.getItem("cart")) || [];

            return cartItems.reduce((sum, item) => {
                const itemTotal = (item?.price || 0) * (item?.quantity || 0);
                return sum + itemTotal;
            }, 0);
        }
    };

    const handleCheckout = async () => {
        const formattedPaymentMethod = paymentMethod === "Thanh Toán Khi Nhận Hàng" ? "COD" :
            paymentMethod === "VnPay" ? "VNPAY" : null;

        if (!formattedPaymentMethod) {
            setErrorMessage("Phương thức thanh toán không hợp lệ!");
            return;
        }
        if (!selectedAddress && !newAddress) {
            setErrorMessage("Vui lòng chọn hoặc nhập địa chỉ trước khi thanh toán!");
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
            amount: product ? quantity : cartData.map((item) => item.quantity),
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
            totalPrice: finalPrice,
            paymentMethod: formattedPaymentMethod,
            status: "pending"
        };
        try {
            const headers = user?.token ? { Authorization: TOKEN_KEY } : {};

            await createOrder(orderData, { headers });
            notifyOfCheckout()
            // window.location.replace("/account");
        } catch (error) {
            console.log(error)
            toast.error("Lỗi khi đặt hàng, vui lòng thử lại!");
        }


    };

    const totalPrice = getTotalPrice();
    const finalPrice = totalPrice + shippingFee;

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
                        totalPrice={totalPrice}
                        shippingFee={shippingFee}
                        finalPrice={finalPrice}
                    />
                    <PaymentMethod
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />

                    {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>}

                    {!user && (
                        <>
                            <p>Bạn muốn nhận thông báo ưu đãi? Hãy
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
                        onClick={handleCheckout}
                        disabled={!selectedAddress && !newAddress}
                    >
                        Xác Nhận Mua Hàng
                    </button>
                </div>
                <ToastContainer />
            </div>
            <LoginModal show={showLogin} setShow={setShowLogin} setShowRegister={setShowRegister} />
            <RegisterModal show={showRegister} setShow={setShowRegister} setShowLogin={setShowLogin} />
        </div>
    );
};

export default Checkout;
