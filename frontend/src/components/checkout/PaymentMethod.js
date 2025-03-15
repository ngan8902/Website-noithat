import React from "react";

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {

    const handlePaymentChange = (method) => {
        console.log("Selected Payment Method:", method);
        setPaymentMethod(method);
    };
    return (
        // <div>
        //     <h5 className="fw-bold mt-4">Phương Thức Thanh Toán</h5>
        //     <div className="d-flex flex-column">
        //         <label className="payment-option">
        //             <input 
        //                 type="radio" 
        //                 name="payment" 
        //                 value="Thanh Toán Khi Nhận Hàng" 
        //                 checked={paymentMethod === "Thanh Toán Khi Nhận Hàng"} 
        //                 onChange={() => setPaymentMethod("Thanh Toán Khi Nhận Hàng")} 
        //             />
        //             <i className="bi bi-collection me-2"></i> Thanh Toán Khi Nhận Hàng
        //         </label>

        //         <label className="payment-option mt-2">
        //             <input 
        //                 type="radio" 
        //                 name="payment" 
        //                 value="VnPay" 
        //                 checked={paymentMethod === "VnPay"} 
        //                 onChange={() => setPaymentMethod("VnPay")} 
        //             />
        //             <i className="bi bi-credit-card me-2"></i> Thanh Toán Qua VnPay
        //         </label>
        //     </div>
        // </div>

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
