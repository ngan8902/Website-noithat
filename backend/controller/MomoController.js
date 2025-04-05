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

        return res.json({ 
            message: "Tạo giao dịch thành công!", 
            payUrl: momoResponse.payUrl, 
            orderId: momoResponse.orderId, 
            resultCode: momoResponse.resultCode 
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server!", error });
    }
};

const verifyPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "Thiếu orderId!" });
        }

        const momoStatus = await transactionStatus(orderId);

        if (momoStatus.resultCode === 0 && momoStatus.transStatus === "0") {
            return res.json({
                message: "Transaction success",
                momoStatus
            });
        } else {
            return res.status(400).json({
                message: "Transaction failed",
                momoStatus
            });
        }
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi xác minh thanh toán!", error });
    }
};

const momoWebhook = async (req, res) => {
    const { orderId, transStatus } = req.body;
    console.log("Webhook nhận từ MoMo:", req.body);

    if (transStatus === "0") {
        // Xử lý thành công giao dịch
        console.log(`Giao dịch ${orderId} thành công!`);
        return res.status(200).json({ message: "Giao dịch thành công!" });
    } else {
        // Xử lý thất bại giao dịch
        console.log(`Giao dịch ${orderId} thất bại!`);
        return res.status(400).json({ message: "Giao dịch thất bại!" });
    }
}

module.exports = { initiateMomoPayment, verifyPaymentStatus, momoWebhook };
