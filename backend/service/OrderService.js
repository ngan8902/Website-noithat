const Order = require("../model/OrderModel");
const Product = require("../model/ProductModel");
const ReceiverInfo = require("../model/ReceiverInfoModel")
const User = require("../model/UserModel");

const generateOrderCode = () => {
    const prefix = "ORD"; // Tiền tố cố định
    const timestamp = Date.now().toString().slice(-6); // 6 chữ số cuối của timestamp
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // Số ngẫu nhiên 4 chữ số
    return `${prefix}${timestamp}${randomDigits}`; // Ví dụ: ORD4567891234
};

const createOrder = async (userId, productIds, validAmount, receiver, status, paymentMethod, totalPrice) => {
    try {
        const products = await Product.find({ _id: { $in: productIds } });

        if (!products || products.length === 0) {
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

        if (!Array.isArray(validAmount) || validAmount.some(a => isNaN(a) || a <= 0)) {
            return {
                status: "ERR",
                message: "Số lượng sản phẩm không hợp lệ"
            };
        }

        const receiverInfor = await ReceiverInfo.create(receiver);
        if (!receiverInfor) {
            return {
                status: "ERR",
                message: "Không thể lưu thông tin người nhận hàng"
            };
        }

        const orderItems = products.map((product, index) => ({
            name: product.name,
            amount: validAmount[index],
            image: product.image,
            price: product.price,
            product: product._id,
        }));

        const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.amount, 0);
        const totalPrice = itemsPrice;

        const orderCode = generateOrderCode();

        const user = userId ? await User.findById(userId).catch(() => null) : null;

        const orderData = {
            orderCode,
            orderItems,
            receiver: receiverInfor._id,
            paymentMethod,
            itemsPrice,
            totalPrice,
            status,
            user: user ? user._id : null
        };

        // Tạo đơn hàng trong database
        const createdOrder = await Order.create(orderData);
        return {
            status: "OK",
            message: "Đơn hàng đã được tạo thành công",
            data: createdOrder
        };
    } catch (e) {
        console.log(e);
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

            order.status = newStatus;

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

const getAllOrders = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find()
                .populate("receiver")
                .populate("orderItems");
            resolve({
                status: 'OK',
                message: 'success',
                data: allOrder
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
    updateOrderStatus,
    getAllOrders
};
