const OrderService = require('../service/OrderService')

const createOrder = async (req, res) => {
    try {
        const { productCode, amount, receiver } = req.body;


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

        const response = await OrderService.createOrder(null, productCode, amount, receiver);
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
};

module.exports = {
    createOrder,
    getOrdersByUser
}
