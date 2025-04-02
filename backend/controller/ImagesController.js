const Images = require("../model/ImageModel");

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: "ERR",
                message: "Không có file nào được tải lên",
            });
        }

        const imageUrl = `/upload/${req.file.filename}`;

        const newImage = new Images({
            filename: req.file.filename,
            path: imageUrl,
        });

        await newImage.save();

        res.json({
            status: "OK",
            message: "Upload thành công!",
            imageUrl: imageUrl,
        });
    } catch (error) {
        console.error("Lỗi upload ảnh:", error);
        res.status(500).json({
            status: "ERR",
            message: "Lỗi server",
        });
    }
};

module.exports = {
    uploadFile
}