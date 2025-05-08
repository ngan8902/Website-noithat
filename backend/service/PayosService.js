const payos = require('../model/PayosModel');

const createPayment = async (amount, description, orderCode, buyerName, buyerPhone, buyerAddress, user) => {
    try {
        let returnUrl;
        if (user) {
            returnUrl = 'https://website-noithat-amber.vercel.app/account';
        } else {
            returnUrl = 'https://website-noithat-amber.vercel.app/guest-order';
        }

        const paymentData = {
            amount,
            description,
            orderCode,
            buyerName,
            buyerPhone,
            buyerAddress,
            returnUrl,
            cancelUrl: 'https://website-noithat-amber.vercel.app'
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
