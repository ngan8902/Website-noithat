const OrderService = require('../service/OrderService')

const createOrder = async (req, res) => {
    try {
        const { productCode, amount, receiver, status } = req.body;


        if (!receiver || !receiver.fullName || !receiver.phone || !receiver.address) {
            return res.status(400).json({
                status: "ERR",
                message: "Thông tin người nhận hàng không đầy đủ"
            });
        }

        if (!productCode || !amount) {
            return res.status(400).json({
                status: "ERR",
                message: "Thiếu mã sản phẩm hoặc số lượng"
            });
        }

        const response = await OrderService.createOrder(null, productCode, amount, receiver, status);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            status: "ERR",
            message: "Lỗi server",
            error: e.message
        });
    }
}

const getOrdersByUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: "ERR",
                message: "Người dùng chưa được xác thực"
            });
        }

        const response = await OrderService.getOrdersByUser(req.user._id);
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

        if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
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

module.exports = {
    createOrder,
    getOrdersByUser,
    getOrderByCode,
    updateOrderStatus
}
