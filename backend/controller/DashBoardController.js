const Order = require("../model/OrderModel");
const Product = require("../model/ProductModel");
const ReceiverInfo = require("../model/ReceiverInfoModel");

exports.getBestSellers = async (req, res) => {
  try {
    const bestSellers = await Order.aggregate([
      //Lọc đơn hàng đã được khách nhận
      { $match: { status: "delivered" } },

      { $unwind: "$orderItems" },

      //Tính quantitySold kể cả khi amount là mảng
      {
        $addFields: {
          quantitySold: {
            $cond: {
              if: { $isArray: "$orderItems.amount" },
              then: { $sum: "$orderItems.amount" },
              else: "$orderItems.amount"
            }
          }
        }
      },

      {
        $group: {
          _id: "$orderItems.product",
          totalQuantity: { $sum: "$quantitySold" },
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },

      {
        $project: {
          _id: 0,
          name: "$productInfo.name",
          quantity: "$totalQuantity",
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json(bestSellers);
  } catch (error) {
    console.error("Lỗi lấy sản phẩm bán chạy:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getTopSpendingCustomers = async (req, res) => {
  try {
    const topCustomers = await Order.aggregate([
      // 1. Chỉ lấy đơn hàng đã nhận
      { $match: { status: "delivered" } },

      // 2. Ép kiểu totalPrice thành số
      {
        $addFields: {
          totalPriceNumber: { $toDouble: "$totalPrice" }
        }
      },

      // 3. Join để lấy thông tin receiver
      {
        $lookup: {
          from: "receiverinfos",
          localField: "receiver",
          foreignField: "_id",
          as: "receiverInfo"
        }
      },
      { $unwind: "$receiverInfo" },

      // 4. Gom nhóm theo fullname + phone (tránh trùng người)
      {
        $group: {
          _id: {
            fullname: "$receiverInfo.fullname",
            phone: "$receiverInfo.phone",
            address: "$receiverInfo.address"
          },
          totalSpent: { $sum: "$totalPriceNumber" },
          orders: { $sum: 1 }
        }
      },

      // 5. Định dạng lại kết quả
      {
        $project: {
          _id: 0,
          fullname: "$_id.fullname",
          phone: "$_id.phone",
          address: "$_id.address",
          totalSpent: 1,
          orders: 1
        }
      },

      // 6. Sắp xếp theo tổng chi tiêu
      { $sort: { totalSpent: -1 } },

      // 7. Giới hạn top 5
      { $limit: 5 }
    ]);

    res.status(200).json(topCustomers);
  } catch (error) {
    console.error("Lỗi khi lấy top khách hàng chi tiêu:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const moment = require("moment");

exports.getDailyRevenue = async (req, res) => {
  try {
    const { date } = req.query;

    const match = { status: "delivered" };

    if (date) {
      const startOfDay = new Date(moment(date).startOf("day").toISOString());
      const endOfDay = new Date(moment(date).endOf("day").toISOString());
      match.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const dailyRevenue = await Order.aggregate([
      { $match: match },

      {
        $addFields: {
          day: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalPriceNumber: { $toDouble: "$totalPrice" }
        }
      },

      {
        $group: {
          _id: "$day",
          totalRevenue: { $sum: "$totalPriceNumber" },
          orders: { $sum: 1 }
        }
      },

      {
        $addFields: {
          weekday: {
            $let: {
              vars: {
                dayOfWeek: { $dayOfWeek: { $dateFromString: { dateString: "$_id" } } }
              },
              in: {
                $arrayElemAt: [
                  ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
                  { $subtract: ["$$dayOfWeek", 1] }
                ]
              }
            }
          }
        }
      },

      { $sort: { _id: 1 } }
    ]);

    res.status(200).json(dailyRevenue);
  } catch (err) {
    console.error("Lỗi lấy doanh thu theo ngày:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getMonthlyRevenue = async (req, res) => {
  try {
    const { year } = req.query;

    const matchConditions = { status: "delivered" };

    // Nếu có năm được chọn thì thêm điều kiện lọc theo năm
    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${+year + 1}-01-01`);
      matchConditions.createdAt = { $gte: start, $lt: end };
    }

    const monthlyRevenue = await Order.aggregate([
      { $match: matchConditions },

      {
        $addFields: {
          month: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" }
          },
          totalPriceNumber: { $toDouble: "$totalPrice" }
        }
      },

      {
        $group: {
          _id: "$month",
          totalRevenue: { $sum: "$totalPriceNumber" },
          orders: { $sum: 1 }
        }
      },

      { $sort: { _id: 1 } }
    ]);

    res.status(200).json(monthlyRevenue);
  } catch (error) {
    console.error("Lỗi lấy doanh thu theo tháng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
