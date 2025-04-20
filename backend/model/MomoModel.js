const crypto = require('crypto');
const axios = require('axios');

// Cấu hình thông tin MoMo
const MOMO_ACCESS_KEY = 'F8BBA842ECF85';
const MOMO_SECRET_KEY = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const MOMO_PARTNER_CODE = 'MOMO';
const MOMO_REDIRECT_URL = 'http://localhost:3000/account';
const MOMO_IPN_URL = 'https://a4f9-2001-ee0-4f03-6390-9463-bf01-4b5b-53c0.ngrok-free.app/api/momo/webhook';

const createMomoPayment = async (amount, orderInfo, items, deliveryInfo, userInfo) => {
    return new Promise((resolve, reject) => {
        const orderId = parseInt(Date.now().toString().slice(-3) + Math.floor(1000 + Math.random() * 9000));
        const requestId = orderId;
        const extraData = "";
        const requestType = "payWithMethod"; //captureWallet
        const autoCapture = true;
        const lang = "vi";

        // Tạo chữ ký HMAC SHA256
        const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${MOMO_IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${MOMO_REDIRECT_URL}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac('sha256', MOMO_SECRET_KEY)
            .update(rawSignature)
            .digest('hex');

        // Tạo request body
        const requestBody = JSON.stringify({
            partnerCode: MOMO_PARTNER_CODE,
            partnerName: "Test",
            storeId: "MoMoFurniture",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: MOMO_REDIRECT_URL,
            ipnUrl: MOMO_IPN_URL,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            items: items,
            deliveryInfo: deliveryInfo,
            userInfo: userInfo,
            signature: signature
        });

        // Cấu hình request HTTPS
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json'
            },
            data: requestBody
        };

        // Gửi request HTTP sử dụng axios
        axios(options)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(`Error: ${error.message}`);
            });
    });
};

const transactionStatus = async (orderId) => {
    const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
        .createHmac("sha256", MOMO_SECRET_KEY)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: "MOMO",
        requestId: orderId,
        orderId,
        signature,
        lang: "vi",
    });

    const options = {
        method: "POST",
        url: 'https://test-payment.momo.vn/v2/gateway/api/query',
        headers: {
            'Content-Type': "application/json"
        },
        data: requestBody
    };

    try {
        const result = await axios(options);
        return result.data;
    } catch (error) {
        console.error('Error fetching transaction status:', error);
        throw error;
    }
};

module.exports = { createMomoPayment, transactionStatus };
