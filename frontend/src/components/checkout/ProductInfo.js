import React, { useState, useEffect } from "react";

const ProductInfo = ({ product, quantity, cart, shippingFee, finalPrice, totalPrice }) => {
    const [cartData, setCartData] = useState(cart || []);

    useEffect(() => {
        if (cart) {
            setCartData(cart);
        }
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
                        <p><strong>{item.productId?.data?.name || item.name}</strong></p>
                        <img src={item.productId?.data?.image || item.image} alt={item.productId?.data?.name || item.name} className="img-fluid rounded mb-2" style={{ width: "100px" }} />
                        <p>Số lượng: {item.quantity}</p>
                        <p>
                            Giá: {(
                                (item.productId?.data?.price || item.price - 
                                ((item.productId?.data?.discount) || (item.discount) ? (item.productId?.data?.price || item.price * item.productId?.data?.discount || item.discount) / 100 : 0)
                                ) * item.quantity
                            ).toLocaleString()} VND
                        </p>

                    </div>
                ))
            }
            <p><strong>Phí Vận Chuyển:</strong> {shippingFee.toLocaleString()} VND</p>
            <p><strong>Tổng:</strong> {totalPrice.toLocaleString()} VND</p>
        </div>
    );
};

export default ProductInfo;
