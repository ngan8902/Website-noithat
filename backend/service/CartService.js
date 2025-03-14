const Cart = require("../model/CartModel")

const addToCart = async (userId, productData) => {
    try {
        let cart;

        if (userId) {
            //Nếu khách hàng đăng nhập → tìm giỏ hàng của user
            cart = await Cart.findOne({ user: userId });

            if (!cart) {
                cart = new Cart({ user: userId, items: [] });
            }
        } else {
            //Nếu khách vãng lai → tìm giỏ hàng đầu tiên không có user
            cart = await Cart.findOne({ user: null });
            if (!cart) {
                cart = new Cart({ user: null, items: [] });
            }
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productData.productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += productData.quantity; // Nếu đã có sản phẩm thì tăng số lượng
        } else {
            cart.items.push({
                product: productData.productId,
                name: productData.name,
                image: productData.image,
                price: productData.price,
                quantity: productData.quantity
            });
        }

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error("Lỗi khi cập nhật giỏ hàng: " + error.message);
    }
}

const getCart = async (userId) => {
    try {
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            return {
                status: "OK",
                message: "Giỏ hàng trống",
                data: []
            };
        }

        return {
            status: "OK",
            message: "Lấy giỏ hàng thành công",
            data: cart
        };
    } catch (error) {
        throw new Error("Lỗi khi lấy giỏ hàng: " + error.message);
    }
}

const removeItem = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) throw new Error("Giỏ hàng không tồn tại");

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error("Lỗi khi xóa sản phẩm khỏi giỏ hàng: " + error.message);
    }
}

const updateCart = async (userId, productId, quantity) => {
    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (productIndex !== -1) {
            cart.items[productIndex].quantity = quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error("Lỗi khi cập nhật giỏ hàng: " + error.message);
    }
}

module.exports = { 
    addToCart,
    getCart,
    removeItem,
    updateCart
}