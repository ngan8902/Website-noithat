import React, { useState, useEffect } from "react";

const ProductInfo = ({ product, quantity, cart, totalPrice, shippingFee, finalPrice }) => {
    const [cartData, setCartData] = useState(cart || []);

    useEffect(() => {
        setCartData(cart);
    }, [cart])

    const displayProducts = product
    ? [{ ...product, quantity }] 
    : cartData;

    return (
        <div className="col-md-6">
            <h5 className="fw-bold">Thông Tin Sản Phẩm</h5>
            {
                displayProducts.map((item, index) => (
                    <div key={index} className="border p-2 mb-2">
                        <p><strong>{item.name}</strong></p>
                        <img src={item.image} alt={item.name} className="img-fluid rounded mb-2" style={{ width: "100px" }} />
                        <p>Số lượng: {item.quantity}</p>
                        <p>Giá: {(item.price * item.quantity).toLocaleString()} VND</p>
                    </div>
                ))
            }
            <p><strong>Phí Vận Chuyển:</strong> {shippingFee.toLocaleString()} VND</p>
            <p><strong>Tổng:</strong> {finalPrice.toLocaleString()} VND</p>
        </div>
    );
};

export default ProductInfo;
