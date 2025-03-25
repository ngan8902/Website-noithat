const CartService = require('../service/CartService')
const mongoose = require('mongoose')

const addToCart = async (req, res) => {
    try {
        const { id: userId } = req['payload'];
        const { productId, quantity } = req.body;
        const cart = await CartService.addToCart(userId || null, productId, quantity);
        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getCart = async (req, res) => {
    try {
        const { payload } = req;
        if (!payload || !payload.id) {
            return res.status(401).json({
                status: "ERROR",
                message: "Không tìm thấy ID người dùng"
            });
        }

        const userId = payload.id;
        const cart = await CartService.getCart(userId);

        return res.status(200).json(cart);
    } catch (error) {
        console.error("Lỗi lấy giỏ hàng:", error);
        return res.status(500).json({
            status: "ERROR",
            message: error.message
        });
    }
}


const removeItem = async (req, res) => {
    try {

        const { itemId } = req.params;
        const userId = req.payload?.id;

        if (!itemId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The itemId is required'
            })
        }

        if (!userId) {
            return res.status(401).json({ message: "Khách vãng lai cần xóa giỏ hàng từ localStorage" });
        }
        

        const response = await CartService.removeItem(itemId, userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const updateCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.payload?.id;

        if (!userId) {
            return res.status(401).json({ message: "Khách vãng lai cần cập nhật giỏ hàng trên localStorage" });
        }

        if (!productId) {
            return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
        }

        if (!quantity || quantity < 1) {
            return res.status(401).json({ message: "Số lượng không hợp lệ" });
        }

        const result = await CartService.updateCart(userId, productId, quantity);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json({ message: "Cập nhật giỏ hàng thành công", items: result.items });
    } catch (error) {
        console.error("Lỗi cập nhật giỏ hàng:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

const clearPurchasedItems = async (req, res) => {
    try {
        const userId = req.payload?.id;
        const { purchasedItems } = req.body;

        console.log(purchasedItems)

        if (!userId) {
            return res.status(401).json({ message: "Người dùng chưa đăng nhập!" });
        }

        if (!purchasedItems || !Array.isArray(purchasedItems) || purchasedItems.length === 0) {
            return res.status(400).json({ message: "Danh sách sản phẩm cần xóa không hợp lệ!" });
        }

        const currentCart = await CartService.getCart(userId);
        if (!currentCart || currentCart.items.length === 0) {
            return res.status(404).json({ message: "Giỏ hàng không có sản phẩm nào để xóa!" });
        }

        const notInCart = purchasedItems.filter(itemId =>
            !currentCart.items.some(item => item._id.toString() === itemId)
        );

        if (notInCart.length > 0) {
            return res.status(400).json({
                message: "Một số sản phẩm không có trong giỏ hàng.",
                missingItems: notInCart
            });
        }

        const updatedCart = await CartService.clearPurchasedItems(userId, purchasedItems);

        return res.status(200).json({
            message: "Đã xóa sản phẩm đã mua khỏi giỏ hàng!",
            cart: updatedCart
        });

    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm sau thanh toán:", error);
        return res.status(500).json({ message: "Lỗi hệ thống!" });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeItem,
    updateCart,
    clearPurchasedItems
}