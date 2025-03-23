const ReceiverInfo = require("../model/ReceiverInfoModel")

const saveNewAddress = async (userId, fullname, phone, address, orderId) => {
    try {
        const existingAddresses = await ReceiverInfo.find({ userId });
        const isDefault = existingAddresses.length === 0;

        const newAddress = new ReceiverInfo({
            userId: userId || null,
            orderId: orderId || null,
            fullname,
            phone,
            address,
            isDefault
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
}

const getAddress = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const addresses = await ReceiverInfo.find({ user: userId });
            if (!addresses.length) {
                return { status: "ERR", message: "Không có địa chỉ nào!" };
            }

            resolve({
                status: 'OK',
                message: 'success',
                data: addresses
            })

        } catch (e) {
            reject(e)
        }
    })
}

const setDefaultAddress = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await ReceiverInfo.updateMany({ userId }, { isDefault: false });
            await ReceiverInfo.findByIdAndUpdate(addressId, { isDefault: true });

            resolve({
                status: "OK",
                message: "Đặt địa chỉ mặc định thành công",
            })
        } catch (error) {
            reject({
                status: "ERR",
                message: "Lỗi khi đặt địa chỉ mặc định",
                error: error.message
            })
        }
    })
}

const getReceiverById = (receiverId) => {
    return new Promise(async (resolve, reject) => {
        try {
           const receiver = await ReceiverInfo.findById(receiverId);
            resolve({
                status: "OK",
                message: "Lấy địa chỉ thành công",
                data: receiver
            })
        } catch (error) {
            reject({
                status: "ERR",
                message: "Lỗi khi lấy địa chỉ ",
                error: error.message
            })
        }
    })
}



module.exports = {
    saveNewAddress,
    getAddress,
    setDefaultAddress,
    getReceiverById
}