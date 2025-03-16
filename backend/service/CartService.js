const Cart = require("../model/CartModel");
const Product = require("../model/ProductModel");

const addToCart = async (userId, productId, quantity) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }

        let cart;
        if (!userId) throw new Error("error");
        //Nếu khách hàng đăng nhập → tìm giỏ hàng của user
        cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId, items: [{
                    productId: product._id,
                    quantity: quantity
                }]
            });
        } else {
            const existingItem = cart.items.find(item => item?.productId.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({
                    productId: product._id,
                    quantity: quantity
                });
            }
        }
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error("Lỗi khi cập nhật giỏ hàng: " + error.message);
    }
}

const getCart = async (userId) => {
    try {
        const cart = await Cart.findOne({ user: userId });

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

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
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

        const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (productIndex !== -1) {
            cart.items[productIndex].quantity = quantity;
        } else {
            cart.items.push({ productId, quantity });
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