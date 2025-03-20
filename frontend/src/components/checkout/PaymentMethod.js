import React from "react";

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {

    const handlePaymentChange = (method) => {
        console.log("Selected Payment Method:", method);
        setPaymentMethod(method);
    };
    return (

        <div>
            <h5 className="fw-bold mt-4">Phương Thức Thanh Toán</h5>
            <div className="d-flex flex-column">
                {["Thanh Toán Khi Nhận Hàng", "VnPay"].map((method) => (
                    <label key={method} className="payment-option mt-2">
                        <input
                            type="radio"
                            name="payment"
                            value={method}
                            checked={paymentMethod === method}
                            onChange={() => handlePaymentChange(method)}
                        />
                        <i className="bi bi-credit-card me-2"></i> {method}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default PaymentMethod;
