const { createMomoPayment, transactionStatus } = require("../model/MomoModel");

const initiateMomoPayment = async (req, res) => {
    try {
        const { amount, orderInfo } = req.body;

        if (!amount || !orderInfo) {
            return res.status(400).json({ message: "Thiếu thông tin thanh toán!" });
        }

        // Tạo giao dịch MoMo
        const momoResponse = await createMomoPayment(amount, orderInfo);
        if (momoResponse.resultCode !== 0) {
            return res.status(400).json({ message: "Lỗi khi tạo giao dịch!", momoResponse });
        }

        const momoStatus = await transactionStatus(momoResponse.orderId);

        return res.json({ message: "Tạo giao dịch thành công!", payUrl: momoResponse.payUrl, orderId: momoResponse.orderId, resultCode: momoResponse.resultCode, momoStatus });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server!", error });
    }
};

module.exports = { initiateMomoPayment };
