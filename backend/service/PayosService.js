const payos = require('../model/PayosModel');

const createPayment = async (amount, description, orderCode, buyerName, buyerPhone, buyerAddress, items) => {
    try {
        const paymentData = {
            amount,
            description,
            orderCode,
            buyerName,
            buyerPhone,
            buyerAddress,
            items,
            returnUrl: 'http://localhost:3000/account',
            cancelUrl: 'http://localhost:3000/home'
        };

        const paymentLink = await payos.createPaymentLink(paymentData);
        return paymentLink;
    } catch (error) {
        throw new Error("Lỗi khi tạo link thanh toán PayOS: " + error.message);
    }
};

const getPaymentStatus = async (paymentLinkId) => {
    try {
        const status = await payos.getPaymentLinkInformation(paymentLinkId);
        return status;
    } catch (error) {
        throw new Error("Lỗi khi lấy trạng thái thanh toán PayOS: " + error.message);
    }
};

module.exports = {
    createPayment,
    getPaymentStatus
};
