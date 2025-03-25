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

    console.log(displayProducts)

    return (
        <div className="col-md-6">
            <h5 className="fw-bold">Thông Tin Sản Phẩm</h5>
            {
                    displayProducts.map((item, index) => (
                        <div key={index} className="border p-2 mb-2">
                            <p><strong>{item.productId?.data.name || item.name || item.product.name}</strong></p>
                            <img 
                                src={item.productId?.data.image || item.image || item.product.image} 
                                alt={item.productId?.data.name || item.name || item.product.name} 
                                className="img-fluid rounded mb-2" 
                                style={{ width: "100px" }} 
                            />
                            <p>
                                Số lượng: 
                                <span style={{ fontWeight: "bold" }}>
                                    {item.quantity}
                                </span>
                            </p>
                            <p>
                                {/* {item.productId?.data?.discount || item.discount ? (
                                    <>
                                        Giá: 
                                        <span style={{ textDecoration: "line-through", color: "red" }}>
                                            {((item.productId?.data?.price || item.price) * item.quantity).toLocaleString()} VND
                                        </span>
                                        {" "} ➝{" "}
                                        <span style={{ fontWeight: "bold" }}>
                                            {(
                                                ((item.productId?.data?.price || item.price) - 
                                                ((item.productId?.data?.price || item.price) * (item.productId?.data?.discount || item.discount) / 100)) * item.quantity
                                            ).toLocaleString()} VND
                                        </span>
                                        {" "} (đã giảm {item.productId?.data?.discount || item.discount}%)
                                    </>
                                ) : (
                                    <> 
                                    Giá: 
                                        <span style={{ fontWeight: "bold" }}>
                                            {((item.productId?.data?.price || item.price) * item.quantity).toLocaleString()} VND */}
                            {item.productId?.data.discount || item.discount || item.product.discount ? (
                                        <>
                                            Giá: 
                                            <span style={{ textDecoration: "line-through", color: "red" }}>
                                                {((item.productId?.data.price || item.price || item.product.price) * item.quantity)?.toLocaleString()} VND
                                            </span>
                                            {" "} ➝{" "}
                                            <span>
                                                {(
                                                    ((item.productId?.data.price || item.price || item.product.price) - 
                                                    ((item.productId?.data.price || item.price || item.product.price) * (item.productId?.data.discount || item.discount || item.product.discount) / 100)) 
                                                    * item.quantity
                                                )?.toLocaleString()} VND
                                            </span>
                                            {" "} (đã giảm {item.productId?.data.discount || item.discount || item.product.discount}%)
                                        </>
                                    ) : (
                                    <> 
                                    Giá: 
                                        <span style={{ fontWeight: "bold" }}>
                                            {(item.productId?.data.price || item.price || item.product.price)?.toLocaleString()} VND
                                        </span>
                                    </>
                                )}
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
