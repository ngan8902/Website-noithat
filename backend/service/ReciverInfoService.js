const ReceiverInfo = require("../model/ReceiverInfoModel")

const saveNewAddress = async (userId, fullName, phone, address) => {
    try {
        const newAddress = new ReceiverInfo({
            fullName,
            phone,
            address,
            userId: userId || null
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

const getAddress = (userId) => {
    return new Promise(async (resolve, reject) => {
        try{
            const addresses = await ReceiverInfo.find({ user: userId });

            if (!addresses.length) {
                return { status: "ERR", message: "Không có địa chỉ nào!" };
            }

            resolve({
                status: 'OK',
                message: 'success',
                data: addresses
            }) 

        }catch(e){
            reject(e)
        }
    })
};


module.exports = {
    saveNewAddress,
    getAddress
}