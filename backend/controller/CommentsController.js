const CommentsService = require('../service/CommentsService');

const addComment = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { content, userId } = req.body;
        // const mediaFilePaths = [];

        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu productId',
            });
        }

        if (!content) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Nội dung bình luận là bắt buộc',
            });
        }

        // if (req.files && req.files['mediaFile']) {
        //     const uploadedFiles = Array.isArray(req.files['mediaFile']) ? req.files['mediaFile'] : [req.files['mediaFile']];
        //     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Chỉ hỗ trợ hình ảnh ở đây
        //     // Nếu bạn muốn hỗ trợ video và audio, hãy thêm chúng vào allowedTypes

        //     for (const file of uploadedFiles) {
        //         if (!allowedTypes.includes(file.mimetype)) {
        //             for (const filePath of mediaFilePaths) {
        //                 await fs.promises.unlink(path.join(__dirname, '../upload', path.basename(filePath)));
        //             }
        //             return res.status(400).json({ message: `Loại file không được hỗ trợ: ${file.originalname}` });
        //         }
        //         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        //         const filename = uniqueSuffix + path.extname(file.originalname);
        //         const filePath = `/upload/${filename}`;
        //         await fs.promises.rename(file.path, path.join(__dirname, '../upload', filename));
        //         mediaFilePaths.push(filePath);
        //     }
        // }

        const data = {
            productId,
            userId,
            content,
            // mediaFile: mediaFilePaths
        };

        const response = await CommentsService.addComment(data);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Lỗi khi thêm bình luận:', error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server khi thêm bình luận',
            error: error.message,
        });
    }
};

const getCommentsByProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu productId',
            });
        }

        const response = await CommentsService.getCommentsByProductId(productId);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Lỗi khi lấy bình luận:', error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server khi lấy bình luận',
            error: error.message,
        });
    }
};


module.exports = {
    addComment,
    getCommentsByProduct
}