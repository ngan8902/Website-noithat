const express = require('express');
const router = express.Router();
const CommentsController = require('../controller/CommentsController');
const { upload } = require('../service/ImagesService')


router.post('/:productId/comments',upload.array("mediaFile", 5), CommentsController.addComment)
router.get("/:productId/get-comments", CommentsController.getCommentsByProduct);




module.exports = router;
