const Order = require("../model/OrderModel");
const Product = require("../model/ProductModel");
const ReceiverInfo = require("../model/ReceiverInfoModel");

exports.getBestSellers = async (req, res) => {
  try {
    const bestSellers = await Order.aggregate([
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
      { $match: { status: "delivered" } },

      // Ép kiểu totalPrice thành số
      {
        $addFields: {
          totalPriceNumber: { $toDouble: "$totalPrice" }
        }
      },

      // Join để lấy thông tin receiver
      {
        $lookup: {
          from: "receiverinfos",
          localField: "receiver",
          foreignField: "_id",
          as: "receiverInfo"
        }
      },
      { $unwind: "$receiverInfo" },

      // Gom nhóm theo phone (tránh trùng người)
      {
        $group: {
          _id: {
            phone: "$receiverInfo.phone"
          },
          fullname: { $first: "$receiverInfo.fullname" },
          address: { $first: "$receiverInfo.address" },
          totalSpent: { $sum: "$totalPriceNumber" },
          orders: { $sum: 1 }
        }
      },

      // Định dạng lại kết quả
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

      // Sắp xếp theo tổng chi tiêu
      { $sort: { totalSpent: -1 } },

      // Giới hạn top 5
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
    const { start, end, limit } = req.query;
    const match = { status: "delivered" };

    if (start && end) {
      const startDate = new Date(new Date(start).setHours(0, 0, 0, 0));
      const endDate = new Date(new Date(end).setHours(23, 59, 59, 999));
      match.updatedAt = { $gte: startDate, $lte: endDate };
    }

    const aggregation = [
      { $match: match },
      {
        $addFields: {
          day: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
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
      { $sort: { _id: -1 } }
    ];

    if (!start && !end && limit) {
      aggregation.push({ $limit: parseInt(limit) });
    }

    aggregation.push({ $sort: { _id: 1 } });

    const dailyRevenue = await Order.aggregate(aggregation);

    res.status(200).json(dailyRevenue);
  } catch (err) {
    console.error("Lỗi lấy doanh thu theo khoảng ngày:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getMonthlyRevenue = async (req, res) => {
  try {
    const { year } = req.query;

    const matchConditions = { status: "delivered" };

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
