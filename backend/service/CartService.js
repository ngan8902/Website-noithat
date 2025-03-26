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

const removeItem = async (itemId, userId) => {
    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return { status: "ERR", message: "Giỏ hàng không tồn tại" };
        }

        const itemIndex = cart.items.findIndex(
            (item) => item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return { status: "ERR", message: "Sản phẩm không có trong giỏ hàng" };
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        return { status: "OK", message: "Xóa sản phẩm thành công", items: cart.items };
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
        return { status: "ERR", message: "Lỗi server" };
    }
};


const updateCart = async (userId, productId, quantity) => {
    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item._id.toString() === productId || item.productId.toString() === productId
        );

        if (existingItemIndex !== -1) {
            cart.items[existingItemIndex].quantity = quantity;
        } else {
            return { success: false, message: "Sản phẩm không có trong giỏ hàng để cập nhật" };
        }

        await cart.save();
        return { success: true, items: cart.items };

    } catch (error) {
        return { success: false, message: "Lỗi khi cập nhật giỏ hàng: " + error.message };
    }
};


const clearPurchasedItems = async (userId, purchasedItems) => {
    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            throw new Error("Giỏ hàng không tồn tại.");
        }

        const updatedItems = cart.items.filter(item => !purchasedItems.includes(item._id.toString()));


        const updatedCart = await Cart.findOneAndUpdate(
            { _id: cart._id, __v: cart.__v },
            { $set: { items: updatedItems } },
            { new: true, runValidators: true }
        );

        if (!updatedCart) {
            throw new Error("Không tìm thấy giỏ hàng hoặc phiên bản không khớp.");
        }

        return updatedCart;
    } catch (error) {
        console.error(error.message);
        throw new Error("Lỗi khi xóa sản phẩm khỏi giỏ hàng: " + error.message);
    }
};



module.exports = {
    addToCart,
    getCart,
    removeItem,
    updateCart,
    clearPurchasedItems
}