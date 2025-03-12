const ReciverInfoService = require('../service/ReciverInfoService')


const saveNewAddress = async (req, res) => {
    try {
        const { fullName, phone, address, userId } = req.body;

        if (!fullName || !phone || !address) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
        }

        const response = await ReciverInfoService.saveNewAddress(null, fullName, phone, address);
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
        const { id } = req.params;
        const address = await ReciverInfoService.getAddress(id);
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

module.exports = {
    saveNewAddress,
    getAddress
}