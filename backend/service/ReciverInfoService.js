const ReceiverInfo = require("../model/ReceiverInfoModel")

const saveNewAddress = async (userId, fullName, phone, address) => {
    try {
        const newAddress = new ReceiverInfo({
            fullName,
            phone,
            address
        });

        await newAddress.save();

        return {
            status: "OK",
            message: "Lưu địa chỉ thành công",
            data: newAddress
        };
    } catch (error) {
        console.error("Lỗi khi lưu địa chỉ:", error);
        return {
            status: "ERR",
            message: "Lỗi khi lưu địa chỉ",
            error: error.message
        };
    }
};


module.exports = {
    saveNewAddress
}