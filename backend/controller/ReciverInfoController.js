const ReciverInfoService = require('../service/ReciverInfoService')


const saveNewAddress = async (req, res) => {
    try {
        const { fullname, phone, address, orderId } = req.body;
        const { userId } = req.params || null
        if (!fullname || !phone || !address) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
        }

        const response = await ReciverInfoService.saveNewAddress(userId, fullname, phone, address, orderId);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            status: "ERR",
            message: "Lỗi server",
            error: e.message
        });
    }
}

const getAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        const address = await ReciverInfoService.getAddress(userId);
        return res.status(200).json({
            status: 'SUCCESS',
            message: 'Get User Success!',
            data: address.data
        })
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const setDefaultAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.body;

        if (!userId || !addressId) {
            return res.status(400).json({ message: "Thiếu userId hoặc addressId" });
        }

        const response = await ReciverInfoService.setDefaultAddress(userId, addressId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: "ERR",
            message: "Lỗi server",
            error: error.message
        });
    }
};

module.exports = {
    saveNewAddress,
    getAddress,
    setDefaultAddress
}