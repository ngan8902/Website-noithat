import React, { useState, useEffect } from "react";

const ProductInfo = ({ product, quantity, cart, shippingFee, finalPrice, totalPrice, selectedProducts }) => {
    const [cartData, setCartData] = useState(cart || []);

    useEffect(() => {
        if (cart) {
            setCartData(cart);
        }
    }, [cart])

    const displayProducts = selectedProducts?.length > 0
        ? selectedProducts
        : (product ? [{ ...product, quantity }] : cartData);

    return (
        <div className="col-md-6">
            <h5 className="fw-bold">Thông Tin Sản Phẩm</h5>
            {displayProducts.map((item, index) => {
                const productName = item.productId?.data?.name || item.name || item.product?.name;
                const productImage = item.productId?.data?.image || item.image || item.product?.image;
                const productPrice = item.productId?.data?.price || item.price || item.product?.price;
                const discount = item.productId?.data?.discount || item.discount || item.product?.discount;
                const hasDiscount = discount > 0;
                const discountedPrice = hasDiscount
                    ? (productPrice - (productPrice * discount) / 100) * item.quantity
                    : productPrice * item.quantity;

                return (
                    <div key={index} className="border p-2 mb-2">
                        <p><strong>{productName}</strong></p>
                        <img
                            src={productImage}
                            alt={productName}
                            className="img-fluid rounded mb-2"
                            style={{ width: "100px" }}
                        />
                        <p>
                            Số lượng: <span style={{ fontWeight: "bold" }}>{item.quantity}</span>
                        </p>
                        {hasDiscount ? (
                            <p>
                                Giá:
                                <span style={{ textDecoration: "line-through", color: "red" }}>
                                    {productPrice.toLocaleString()} VND
                                </span>
                                {" "}➝{" "}
                                <span style={{ fontWeight: "bold" }}>
                                    {discountedPrice.toLocaleString()} VND
                                </span>
                                {" "}(đã giảm {discount}%)
                            </p>
                        ) : (
                            <p>
                                Giá:
                                <span style={{ fontWeight: "bold" }}>
                                    {productPrice.toLocaleString()} VND
                                </span>
                            </p>
                        )}
                    </div>
                );
            })}
            <p><strong>Phí Vận Chuyển:</strong> {shippingFee.toLocaleString()} VND</p>
            <p><strong>Tổng:</strong> {totalPrice.toLocaleString()} VND</p>
        </div>
    );

};

export default ProductInfo;
