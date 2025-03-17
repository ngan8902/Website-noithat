const CartService = require('../service/CartService')

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
        const { productId } = req.params;
        const userId = req.payload?.id;

        if (!userId) {
            return res.status(401).json({ message: "Khách vãng lai cần xóa giỏ hàng từ localStorage" });
        }

        const items = await CartService.removeItem(userId, productId);
        return res.status(200).json({ message: "Xóa sản phẩm thành công", items });
    } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
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

        const items = await CartService.updateCart(userId, productId, quantity);
        return res.status(200).json({ message: "Cập nhật giỏ hàng thành công", items });
    } catch (error) {
        console.error("Lỗi cập nhật giỏ hàng:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}


module.exports = {
    addToCart,
    getCart,
    removeItem,
    updateCart
}