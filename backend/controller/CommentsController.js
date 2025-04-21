const CommentsService = require('../service/CommentsService');

const addComment = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { content, userId } = req.body;

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

        const data = {
            productId,
            userId,
            content,
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