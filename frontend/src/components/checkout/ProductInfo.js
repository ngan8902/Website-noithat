import React, { useState, useEffect } from "react";
import { UPLOAD_URL } from '../../constants/url.constant';

const ProductInfo = ({ product, quantity, cart, shippingFee, totalPrice, selectedProducts }) => {
    const [cartData, setCartData] = useState(cart || []);

    useEffect(() => {
        if (cart) {
            setCartData(cart);
        }
    }, [cart]);

    const displayProducts = selectedProducts?.length > 0
        ? selectedProducts
        : (product ? [{ ...product, quantity }] : cartData);


    const getImageUrl = (item, product) => {
        if (item?.image && item?.image.startsWith('http')) {
            return item.image;
        }
        if (item?.productId?.data?.image) {
            return `${UPLOAD_URL}${item.productId.data.image}`;
        }
        if (item?.product?.image) {
            return `${UPLOAD_URL}${item.product.image}`;;
        }
        if (product?.image) {
            return `${UPLOAD_URL}${product.image}`;;
        }
        if (item?.image) {
            return `${UPLOAD_URL}${item.image}`;;
        }
        return "https://via.placeholder.com/100";
    };


    return (
        <div className="col-md-6">
            <h5 className="fw-bold">Thông Tin Sản Phẩm</h5>
            {displayProducts.map((item, index) => {
                const productName = item.productId?.data?.name || item.name || item.product?.name;
                let productPrice = item.productId?.data?.price || item.price || item.product?.price;
                const discount = item.productId?.data?.discount || item.discount || item.product?.discount;
                const hasDiscount = discount > 0;
                if (hasDiscount) {
                    productPrice = productPrice - (productPrice * discount) / 100;
                }
                const discountedPrice = productPrice * item.quantity

                return (
                    <div key={index} className="border p-2 mb-2">
                        <p><strong>{productName}</strong></p>
                        <img
                            src={getImageUrl(item, product)}
                            alt={productName}
                            className="img-fluid rounded mb-2"
                            style={{ width: "100px" }}
                        />
                        <p>
                            Số lượng: <span style={{ fontWeight: "bold" }}>{item.quantity}</span>
                        </p>
                        {hasDiscount ? (
                            <p>
                                Đơn giá:
                                <span style={{ textDecoration: "line-through", color: "red" }}>
                                    {productPrice.toLocaleString()} VND
                                </span>
                                {" "}(đã giảm {discount}%)
                                {" "}➝{" "}
                                <span style={{ fontWeight: "bold" }}>
                                    {discountedPrice.toLocaleString()} VND
                                </span>
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