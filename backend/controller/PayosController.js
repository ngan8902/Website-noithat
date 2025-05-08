const payosService = require('../service/PayosService');
const OrderService = require('../service/OrderService');
const TemporaryOrder = require('../model/TemporaryModel');

const initiatePayment = async (req, res) => {
    try {
        const { amount, description, orderCode, buyerName, buyerPhone, buyerAddress, tempOrderData, user } = req.body;

        if (!amount || !description || !orderCode || !tempOrderData) {
            return res.status(400).json({ message: "Thiếu thông tin thanh toán!" });
        }

        const paymentLink = await payosService.createPayment(amount, description, orderCode, buyerName, buyerPhone, buyerAddress, user);
        console.log("Link thanh toán PayOS:", paymentLink);

        await TemporaryOrder.create({
            orderCode,
            paymentLinkId: paymentLink.paymentLinkId,
            data: tempOrderData
        });

        res.json({ checkoutUrl: paymentLink.checkoutUrl, paymentLinkId: paymentLink.paymentLinkId});
    } catch (error) {
        console.error("Lỗi từ initiatePayment:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const checkPaymentStatus = async (req, res) => {
    try {
        const { paymentLinkId } = req.params;

        if (!paymentLinkId) {
            return res.status(400).json({ message: "Thiếu paymentLinkId!" });
        }

        const statusData = await payosService.getPaymentStatus(paymentLinkId);

        if (statusData.status === 'PAID') {
            const tempOrder = await TemporaryOrder.findOne({ paymentLinkId });

            if (!tempOrder) {
                return res.status(404).json({ message: "Không tìm thấy đơn tạm!" });
            }

            await TemporaryOrder.deleteOne({ paymentLinkId });

            return res.status(200).json({ 
                message: "Thanh toán thành công đã tạo đơn hàng.", 
                orderData: tempOrder.data, 
            });
        } else {
            return res.status(200).json({ message: `Trạng thái thanh toán: ${statusData.status}` });
        }
    } catch (error) {
        console.error("Lỗi checkPaymentStatus:", error.message);
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
    checkPaymentStatus,
    receiveWebhook
};
