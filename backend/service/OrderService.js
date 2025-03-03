const Order = require("../model/OrderModel");
const Product = require("../model/ProductModel");
const ReceiverInfo = require("../model/ReceiverInfoModel")

const createOrder = async (userId, productCode, amount, receiverInfo) => {
    try {
        const product = await Product.findOne({ productCode });

        if (!product) {
            return {
                status: "ERR",
                message: "Không tìm thấy sản phẩm với mã này"
            };
        }

        // Lưu thông tin người nhận hàng vào database
        const receiver = await ReceiverInfo.create(receiverInfo);

        const itemsPrice = product.price * amount;
        const shippingPrice = 50000; // Phí vận chuyển cố định
        const taxPrice = itemsPrice * 0.1; // Thuế 10%
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        const orderData = {
            orderItems: [{
                name: product.name,
                amount,
                image: product.image,
                price: product.price,
                product: product._id,
            }],
            shippingAddress: receiver._id,
            paymentMethod: "COD", 
            shippingPrice,
            taxPrice,
            totalPrice,
            user: userId
        };

        const createdOrder = await Order.create(orderData);
        return {
            status: "OK",
            message: "Đơn hàng đã được tạo thành công",
            data: createdOrder
        };
    } catch (e) {
        return {
            status: "ERR",
            message: "Lỗi khi tạo đơn hàng",
            error: e.message
        };
    }
};

module.exports = { 
    createOrder
};
