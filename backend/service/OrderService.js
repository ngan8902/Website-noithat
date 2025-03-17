const Order = require("../model/OrderModel");
const Product = require("../model/ProductModel");
const ReceiverInfo = require("../model/ReceiverInfoModel")
const User = require("../model/UserModel");

const generateOrderCode = () => {
    const prefix = "ORD"; // Tiền tố cố định
    const timestamp = Date.now().toString().slice(-6); // 6 chữ số cuối của timestamp
    // const randomDigits = Math.floor(1000 + Math.random() * 9000); // Số ngẫu nhiên 4 chữ số
    return `${prefix}${timestamp}${randomDigits}`; // Ví dụ: ORD4567891234
};
// const validPaymentMethods = ["COD", "VnPay"];

const createOrder = async (userId, productCode, amount, receiver, status, paymentMethod) => {
    try {
        const product = await Product.findOne({ productCode });
        const user = userId ? await User.findById(userId) : null;        
        console.log(userId)
        if (!product) {
            return {
                status: "ERR",
                message: "Không tìm thấy sản phẩm với mã này"
            };
        }

        if (!paymentMethod) {
            return {
                status: "ERR",
                message: "Phương thức thanh toán không hợp lệ"
            };
        }

        // Lưu thông tin người nhận hàng vào database
        const receiverInfor = await ReceiverInfo.create(receiver);

        if (!receiverInfor) {
            return {
                status: "ERR",
                message: "Không thể lưu thông tin người nhận hàng"
            };
        }

        const itemsPrice = product.price * amount;
        const shippingPrice = 50000; // Phí vận chuyển cố định
        const taxPrice = itemsPrice * 0.1; // Thuế 10%
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        const orderCode = generateOrderCode();

        const orderData = {
            orderCode,
            orderItems: [{
                name: product.name,
                amount,
                image: product.image,
                price: product.price,
                product: product._id,
            }],
            receiver: receiverInfor._id,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            status,
            user:  user ? user._id : null
        };

        const createdOrder = await Order.create(orderData);
        return {
            status: "OK",
            message: "Đơn hàng đã được tạo thành công",
            data: createdOrder
        };
    } catch (e) {
        console.log(e)
        return {
            status: "ERR",
            message: "Lỗi khi tạo đơn hàng",
            error: e.message
        };
    }
};

const getOrdersByUser = async (userId) => {
    try {
        const orders = await Order.find({ user: userId });

        if (!orders) {
            return {
                status: "OK",
                message: "Đơn hàng trống",
                data: []
            };
        }

        return {
            status: "OK",
            message: "Lấy danh sách đơn hàng thành công",
            data: orders
        };
    } catch (e) {
        return {
            status: "ERR",
            message: "Lỗi khi lấy danh sách đơn hàng",
        };
    }
};

const getOrderByCode = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findOne({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })

        } catch (e) {
            reject(e)
        }
    })
};

const updateOrderStatus = (orderId, newStatus) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error("Không tìm thấy đơn hàng.");
            }

            order.orderStatus = newStatus;

            if (newStatus === "delivered") {
                order.isDelivered = true;
                order.deliveredAt = new Date();
            }

            await order.save();

            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })

        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    createOrder,
    getOrdersByUser,
    getOrderByCode,
    updateOrderStatus
};
