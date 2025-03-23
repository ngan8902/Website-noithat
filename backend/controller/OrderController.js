const OrderService = require('../service/OrderService')

const createOrder = async (req, res) => {
    try {
        const { userId, productId, amount, discount, receiver, status, paymentMethod, totalPrice, orderDate, delivered, shoppingFee } = req.body;

        if (!receiver || !receiver.fullname || !receiver.phone || !receiver.address) {
            return res.status(401).json({
                status: "ERR",
                message: "Thông tin người nhận hàng không đầy đủ"
            });
        }

        const productIds = Array.isArray(productId) ? productId : [productId];
        const validAmount = Array.isArray(amount) ? amount.map(Number) : [Number(amount)];

        if (productIds.length !== validAmount.length) {
            return res.status(401).json({
                status: "ERR",
                message: "Danh sách sản phẩm và số lượng không khớp"
            });
        }

        const response = await OrderService.createOrder(userId, productIds, discount, validAmount, receiver, status,shoppingFee, paymentMethod, totalPrice, orderDate, delivered);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "ERR",
            message: "Lỗi server",
            error: e.message
        });
    }
};

const getOrdersByUser = async (req, res) => {
    try {
        const { payload } = req;
        if (!payload || !payload.id) {
            return res.status(401).json({
                status: "ERR",
                message: "Người dùng chưa được xác thực"
            });
        }

        const userId = payload.id;
        const response = await OrderService.getOrdersByUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "ERR",
            message: "Lỗi server",
        });
    }
}

const getOrderByCode = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The order is required'
            })
        }
        const response = await OrderService.getOrderByCode(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;

        if (!["pending", "processing", "shipped", "delivered", "cancelled", "return", "received", "return_requested"].includes(status)) {
            return res.status(401).json({ message: "Trạng thái không hợp lệ." });
        }

        const response = await OrderService.updateOrderStatus(orderId, status)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const response = await OrderService.getAllOrders()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

module.exports = {
    createOrder,
    getOrdersByUser,
    getOrderByCode,
    updateOrderStatus,
    getAllOrders
}
