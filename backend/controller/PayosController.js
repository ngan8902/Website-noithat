const payosService = require('../service/PayosService');

const initiatePayment = async (req, res) => {
    try {
        const { amount, description, orderCode } = req.body;

        if (!amount || !description || !orderCode) {
            return res.status(400).json({ message: "Thiếu thông tin thanh toán!" });
        }

        const paymentLink = await payosService.createPaymentLink(amount, description, orderCode);
        res.json({ checkoutUrl: paymentLink.checkoutUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Nhận webhook từ PayOS khi có thay đổi trạng thái đơn hàng
const receiveWebhook = async (req, res) => {
    console.log("Webhook nhận từ PayOS:", req.body);
    res.status(200).json({ message: "Đã nhận webhook" });
};

module.exports = {
    initiatePayment,
    receiveWebhook
};
