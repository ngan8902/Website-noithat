const OrderService = require('../service/OrderService')

const createOrder = async (req, res) => {
    try {
        const { productCode, amount, receiverInfo } = req.body;
        
        if (!req.user) {
            return res.status(401).json({
                status: "ERR",
                message: "Người dùng chưa được xác thực"
            });
        }


        if (!receiverInfo || !receiverInfo.fullName || !receiverInfo.phone || !receiverInfo.address) {
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

        const response = await OrderService.createOrder(req.user._id, productCode, amount, receiverInfo);
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

module.exports = {
    createOrder
}
