const OrderService = require('../service/OrderService');
const Product = require('../model/ProductModel')

const createOrder = async (req, res) => {
    try {
        const { userId, productId, amount, discount, receiver, status, paymentMethod, totalPrice, orderDate, delivered, shoppingFee, countInStock, rating } = req.body;

        if (!receiver || !receiver.fullname || !receiver.phone || !receiver.address) {
            return res.status(401).json({
                status: "ERR",
                message: "Thông tin người nhận hàng không đầy đủ"
            });
        }

        const productIds = Array.isArray(productId) ? productId : [productId];
        const validAmount = Array.isArray(amount) ? amount.map(Number) : [Number(amount)];

        if (productIds.length !== validAmount.length) {
            return res.status(401).json({
                status: "ERR",
                message: "Danh sách sản phẩm và số lượng không khớp"
            });
        }

        const response = await OrderService.createOrder(userId, productIds, discount, validAmount, receiver, status, shoppingFee, paymentMethod, totalPrice, orderDate, delivered, countInStock, rating);
        return res.status(200).json({
            ...response,
            orderCode: response?.data?.orderCode
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "ERR",
            message: "Lỗi server",
            error: e.message
        });
    }
};

const getOrdersByUser = async (req, res) => {
    try {
        const { payload } = req;
        if (!payload || !payload.id) {
            return res.status(401).json({
                status: "ERR",
                message: "Người dùng chưa được xác thực"
            });
        }

        const userId = payload.id;
        const response = await OrderService.getOrdersByUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "ERR",
            message: "Lỗi server",
        });
    }
}

const getOrderByCode = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The order is required'
            })
        }
        const response = await OrderService.getOrderByCode(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const getOrderByGuestCode = async (req, res) => {
  try {
    const orderCode = req.params.code;

    if (!orderCode) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Mã đơn hàng là bắt buộc',
      });
    }

    const response = await OrderService.getOrderByGuestCode(orderCode);

    if (!response || !response.data) {
      return res.status(404).json({
        status: 'ERR',
        message: 'Không tìm thấy đơn hàng với mã đã nhập',
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi khi truy vấn đơn hàng guest:', error);
    return res.status(500).json({
      status: 'ERR',
      message: 'Lỗi server',
    });
  }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;

        const validStatuses = [
            "pending", "processing", "shipped", "delivered", 
            "cancelled", "return", "received", 
            "return_requested", "cancelled_confirmed"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ." });
        }

        const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
        if (!updatedOrder) {
            return res.status(401).json({ message: "Không tìm thấy đơn hàng." });
        }

        if ((status === "cancelled_confirmed" || status === "return") && updatedOrder?.data?.orderItems?.length) {
            const updateStockPromises = updatedOrder.data.orderItems.map(async (item) => {
                if (!item.product) return console.warn(`Sản phẩm không có ID hợp lệ:`, item);

                const product = await Product.findById(item.product.toString());
                if (product) {
                    product.countInStock = (Number(product.countInStock) || 0) + Number(item.amount);
                    return product.save();
                } else {
                    console.warn(`Không tìm thấy sản phẩm với ID: ${item.product}`);
                }
            });

            await Promise.all(updateStockPromises);

            if (status === "cancelled_confirmed") {
                await OrderService.deleteOrderId(orderId);
                return res.status(200).json({ message: "Đơn hàng đã được xác nhận hủy và xóa thành công." });
            }
        }

        // if (status === "cancelled_confirmed") {
        //     await OrderService.deleteOrderId(orderId);
        //     return res.status(200).json({ message: "Đơn hàng đã được xác nhận hủy và xóa thành công." });
        // }

        return res.status(200).json(updatedOrder);
    } catch (e) {
        console.error("Lỗi cập nhật trạng thái đơn hàng:", e);
        return res.status(500).json({ message: "Lỗi server" });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const response = await OrderService.getAllOrders()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const deleteOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await OrderService.deleteOrderId(orderId);

        if (!result.success) {
            return res.status(401).json({ success: false, message: result.message });
        }

        res.status(200).json({ success: true, message: result.message, data: result.data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateOrderRating = async (req, res) => {
    try {
      const { orderId, rating, feedback } = req.body;
  
      if (!orderId || rating === undefined) {
        return res.status(400).json({
          status: "ERR",
          message: "Missing orderId or rating",
        });
      }
  
      const response = await OrderService.updateOrderRating(orderId, rating, feedback);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        status: "ERR",
        message: error.message,
      });
    }
  };

module.exports = {
    createOrder,
    getOrdersByUser,
    getOrderByCode,
    getOrderByGuestCode,
    updateOrderStatus,
    getAllOrders,
    deleteOrderId,
    updateOrderRating
}
