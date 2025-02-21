import React from "react";

const ProductInfo = ({ product, quantity, cart, totalPrice, shippingFee, finalPrice }) => {
    return (
        <div className="col-md-6">
            <h5 className="fw-bold">Thông Tin Sản Phẩm</h5>

            {product ? (
                <>
                    <img src={product.image} alt={product.name} className="img-fluid rounded mb-3" style={{ width: "200px" }}/>
                    <p><strong>Sản Phẩm:</strong> {product.name}</p>
                    <p><strong>Số Lượng:</strong> {quantity}</p>
                    <p><strong>Giá:</strong> {totalPrice.toLocaleString()} VND</p>
                </>
            ) : (
                cart.map((item, index) => (
                    <div key={index} className="border p-2 mb-2">
                        <p><strong>{item.name}</strong></p>
                        <img src={item.image} alt={item.name} className="img-fluid rounded mb-2" style={{ width: "100px" }}/>
                        <p>Số lượng: {item.quantity}</p>
                        <p>Giá: {(item.price * item.quantity).toLocaleString()} VND</p>
                    </div>
                ))
            )}

            <p><strong>Phí Vận Chuyển:</strong> {shippingFee.toLocaleString()} VND</p>
            <p><strong>Tổng:</strong> {finalPrice.toLocaleString()} VND</p>
        </div>
    );
};

export default ProductInfo;
