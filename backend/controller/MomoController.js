const { createMomoPayment, transactionStatus } = require("../model/MomoModel");
const OrderService = require('../service/OrderService');
const TemporaryOrder = require('../model/TemporaryModel');

const initiateMomoPayment = async (req, res) => {
    try {
        const { amount, orderInfo, items, deliveryInfo, userInfo, tempOrderData } = req.body;
        console.log("Dữ liệu thanh toán MoMo:", req.body);

        if (!amount || !orderInfo) {
            return res.status(400).json({ message: "Thiếu thông tin thanh toán!" });
        }

        // Tạo giao dịch MoMo
        const momoResponse = await createMomoPayment(amount, orderInfo, items, deliveryInfo, userInfo);

        await TemporaryOrder.create({
            orderCode: momoResponse.orderId,
            paymentLinkId: momoResponse.orderId,
            data: tempOrderData
        });

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
        console.error("Lỗi khi xử lý momo/pay:", error);
        res.status(500).json({ message: "Lỗi server MoMo" });
    }
};

const verifyPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({ message: "Thiếu orderId!" });
        }

        const momoStatus = await transactionStatus(orderId);
        console.log("Trạng thái giao dịch MoMo:", momoStatus);

        if (momoStatus.resultCode === 0) {
            const tempOrder = await TemporaryOrder.findOne({ orderCode: orderId });

            if (!tempOrder) {
                return res.status(404).json({ message: "Không tìm thấy đơn tạm!" });
            }

            await TemporaryOrder.deleteOne({ orderCode: orderId });

            return res.json({
                message: "Transaction success",
                momoStatus,
                orderData: tempOrder.data,
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
