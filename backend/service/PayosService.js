const payos = require('../model/PayosModel');

const createPaymentLink = async (amount, description, orderCode) => {
    try {
        const paymentData = {
            amount,
            description,
            orderCode,
            returnUrl: 'http://localhost:3000/account',
            cancelUrl: 'http://localhost:3000/home'
        };

        const paymentLink = await payos.createPaymentLink(paymentData);
        return paymentLink;
    } catch (error) {
        throw new Error("Lỗi khi tạo link thanh toán PayOS: " + error.message);
    }
};

module.exports = {
    createPaymentLink
};
