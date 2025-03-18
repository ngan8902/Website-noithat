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

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return { status: "ERR", message: "Sản phẩm không tồn tại trong giỏ hàng" };
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        return { status: "OK", message: "Xóa sản phẩm thành công", cart };
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

        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        return cart.items;

    } catch (error) {
        throw new Error("Lỗi khi cập nhật giỏ hàng: " + error.message);
    }
};

const clearPurchasedItems = async (userId, purchasedItems) => {
    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new Error("Giỏ hàng không tồn tại!");
        }

        const purchasedItemsSet = new Set(purchasedItems.map(item => item.toString()));

        cart.items = cart.items.filter(item => !purchasedItemsSet.includes(item.productId.toString()));

        await cart.save();
        return cart;
    } catch (error) {
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