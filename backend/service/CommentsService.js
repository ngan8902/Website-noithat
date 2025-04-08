const Comment = require('../model/CommentModel');

const addComment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newComment = new Comment(data);
            const savedComment = await newComment.save();
            resolve({
                status: 'OK',
                message: 'Bình luận đã được thêm thành công',
                data: savedComment,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getCommentsByProductId = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const comments = await Comment.find({ productId: productId })
                .populate('userId', 'name avatar'); 
            resolve({
                status: 'OK',
                message: 'Lấy danh sách bình luận thành công',
                data: comments,
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    addComment,
    getCommentsByProductId
};