const Order = require("../model/OrderModel");
const Product = require("../model/ProductModel");
const ReceiverInfo = require("../model/ReceiverInfoModel")
const User = require("../model/UserModel");

const generateOrderCode = () => {
    const prefix = "ORD"; // Tiền tố cố định
    const timestamp = Date.now().toString().slice(-6); // 6 chữ số cuối của timestamp
    return `${prefix}${timestamp}`; 
};

const createOrder = async (userId, productIds, discount, validAmount, receiver, status,shoppingFee, paymentMethod, totalPrice, orderDate, delivered, countInStock) => {
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
            discount: product.discount,
            product: product._id,
        }));

        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Sản phẩm không tồn tại: ${item.name}` });
            }
    
            if (product.countInStock < item.amount) {
                return res.status(400).json({
                    message: `Sản phẩm ${item.name} chỉ còn ${product.countInStock} trong kho`,
                });
            }
    
            product.countInStock -= item.amount;
            await product.save();
        }

        const itemsPrice = orderItems.reduce((sum, item) => {
            const itemTotal = item.price * item.amount;
            const discount = item.discount ? itemTotal * (item.discount / 100) : 0;
            return sum + (itemTotal - discount);
        }, 0);
        const totalPrice = itemsPrice;

        const orderCode = generateOrderCode();

        const user = userId ? await User.findById(userId).catch(() => null) : null;

        const orderData = {
            orderCode,
            orderItems,
            receiver: receiverInfor._id,
            paymentMethod,
            totalPrice,
            orderDate,
            delivered,
            shoppingFee,
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
        const orders = await Order.find({ user: userId })
        .populate("orderItems.product")
        .populate("receiver"); 

        if (!orders || orders.length === 0) {
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

            console.log()

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

const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return { status: "ERR", message: "Không tìm thấy đơn hàng." };
        }

        if (order.status === newStatus) {
            return { status: "OK", message: "Trạng thái đơn hàng không thay đổi.", data: order };
        }

        order.status = newStatus;
        if (newStatus === "delivered") {
            order.isDelivered = true;
            order.deliveredAt = new Date();
        }
        order.updatedAt = new Date();

        await order.save();

        return { status: "OK", message: "Cập nhật trạng thái thành công", data: order };
    } catch (e) {
        console.error("Lỗi cập nhật trạng thái đơn hàng:", e);
        return { status: "ERR", message: "Lỗi server" };
    }
};


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

const deleteOrderId = async (orderId) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return { success: false, message: "Order not found" };
        }
        return { success: true, message: "Order deleted successfully", data: deletedOrder };
    } catch (error) {
        throw new Error("Error deleting order: " + error.message);
    }
};



module.exports = {
    createOrder,
    getOrdersByUser,
    getOrderByCode,
    updateOrderStatus,
    getAllOrders,
    deleteOrderId
};
