const CartService = require('../service/CartService')

const addToCart = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        const { productId, name, image, price, quantity } = req.body;

        const cart = await CartService.addToCart(userId, { productId, name, image, price, quantity });

        return res.status(200).json({ message: "Thêm vào giỏ hàng thành công!", cart });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
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
        const cart = await CartService.removeItem(req.user._id, req.params.productId);
        return res.status(200).json({ message: "Xóa sản phẩm thành công!", cart });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.payload ? req.payload.id : null;

        if (!productId || quantity < 1) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });
        }

        if (userId) {
            const updatedCart = await CartService.updateCart(userId, productId, quantity);
            return res.status(200).json({ message: "Cập nhật giỏ hàng thành công!", items: updatedCart.items });
        } else {
            return res.status(401).json({ message: "Khách vãng lai phải cập nhật giỏ hàng trên localStorage" });
        }
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