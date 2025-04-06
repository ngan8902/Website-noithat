const payosService = require('../service/PayosService');
const OrderService = require('../service/OrderService');
const TemporaryOrder = require('../model/TemporaryModel');

const initiatePayment = async (req, res) => {
    try {
        const { amount, description, orderCode, tempOrderData } = req.body;

        if (!amount || !description || !orderCode || !tempOrderData) {
            return res.status(400).json({ message: "Thiếu thông tin thanh toán!" });
        }

        await TemporaryOrder.create({
            orderCode,
            data: tempOrderData
        });

        const paymentLink = await payosService.createPaymentLink(amount, description, orderCode);
        res.json({ checkoutUrl: paymentLink.checkoutUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Nhận webhook từ PayOS khi có thay đổi trạng thái đơn hàng
const receiveWebhook = async (req, res) => {
    const { code, orderCode } = req.body;
    console.log("Webhook nhận từ PayOS:", req.body);

    if (code === '00') {
        try {
            const tempOrder = await TemporaryOrder.findOne({ orderCode });

            if (!tempOrder) {
                return res.status(404).json({ message: "Không tìm thấy đơn hàng tạm!" });
            }

            await OrderService.createOrder(tempOrder.data); // tạo đơn hàng chính thức

            await TemporaryOrder.deleteOne({ orderCode }); // xóa đơn tạm

            return res.status(200).json({ message: "Tạo đơn hàng thành công sau khi thanh toán." });
        } catch (error) {
            console.error("Lỗi khi xử lý webhook PayOS:", error);
            return res.status(500).json({ message: "Lỗi server khi xử lý webhook!" });
        }
    } else {
        return res.status(200).json({ message: "Thanh toán chưa thành công." });
    }
};

module.exports = {
    initiatePayment,
    receiveWebhook
};
