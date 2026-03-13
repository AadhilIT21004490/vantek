import { getPercentageChange } from "@/helper/getPercentageChange";
import connectDB from "@/lib/db";
import { isAdmin } from "@/lib/middleware";
import Order, { IOrder } from "@/lib/models/order";
import Product, { IProduct } from "@/lib/models/product";
import User, { IUser } from "@/lib/models/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache
let cachedInsights: any = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const GET = async (req: NextRequest) => {
  try {
    const isAdminMiddlewareResponse = await isAdmin(req);
    if (isAdminMiddlewareResponse) {
      return isAdminMiddlewareResponse;
    }

    const now = Date.now();

    // ✅ Return cached data if it's still fresh
    if (cachedInsights && now - lastFetchTime < CACHE_TTL) {
      return NextResponse.json(cachedInsights);
    }

    await connectDB();

    const currentDate = new Date();
    const startOfThisMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const startOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    // === ORDERS & SALES INSIGHTS FOR MAIN CARDS ===
    const thisMonthOrders = await (Order as mongoose.Model<IOrder>).find({
      createdAt: { $gte: startOfThisMonth },
      paymentStatus: "paid",
    });

    const lastMonthOrders = await (Order as mongoose.Model<IOrder>).find({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      paymentStatus: "paid",
    });

    const totalOrdersThisMonth = thisMonthOrders.length;
    const totalSalesThisMonth = thisMonthOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalOrdersLastMonth = lastMonthOrders.length;
    const totalSalesLastMonth = lastMonthOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // === USERS INSIGHTS FOR MAIN CARDS ===
    const totalUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfThisMonth },
      role: "user",
    });

    const totalUsersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      role: "user",
    });

    const registeredCustomers = await User.countDocuments({ role: "user" });

    // === GROWTH CALCULATIONS FOR MAIN CARDS ===
    const orderGrowth = getPercentageChange(
      totalOrdersThisMonth,
      totalOrdersLastMonth
    );
    const salesGrowth = getPercentageChange(
      totalSalesThisMonth,
      totalSalesLastMonth
    );
    const customerGrowth = getPercentageChange(
      totalUsersThisMonth,
      totalUsersLastMonth
    );

    // SALES BY CATEGORY PIE-CHART INFO

    const mainCategories = [
      "VW-T6",
      "VW-T6.1",
      "VW-T7",
      "Universal Camper Parts",
    ];
    const colors = ["#2DD4BF", "#F59E0B", "#38BDF8", "#8B5CF6"];

    // Step 1: Fetch paid orders and populate products
    const paidOrders = await (Order as mongoose.Model<IOrder>)
      .find({ paymentStatus: "paid" })
      .populate("items.product");

    // Step 2: Calculate sold quantity per category
    const categoryCountMap = new Map<string, number>();

    for (const order of paidOrders) {
      for (const item of order.items) {
        const product = item.product as unknown as IProduct;
        const category = product.mainCategory;
        const prevQty = categoryCountMap.get(category) || 0;
        categoryCountMap.set(category, prevQty + item.quantity);
      }
    }

    // Step 3: Compute total sold quantity
    const totalSoldQty = mainCategories.reduce(
      (sum, cat) => sum + (categoryCountMap.get(cat) || 0),
      0
    );

    // Step 4: Build full categoryData array
    const categoryData = mainCategories.map((name, index) => {
      const value = categoryCountMap.get(name) || 0;
      const percentage =
        totalSoldQty === 0
          ? "0.00%"
          : ((value / totalSoldQty) * 100).toFixed(2) + "%";

      return {
        name,
        value,
        color: colors[index % colors.length],
        percentage,
      };
    });

    //END OF SALES BY CATEGORY PIE-CHART INFO

    // TOP CUSTOMERS TABLE INFO
    const topCustomers = await (User as mongoose.Model<IUser>)
      .find(
        { totalSpent: { $gt: 0 } }, // optional filter to exclude zero spenders
        { name: 1, email: 1, totalSpent: 1, _id: 1 } // fields to return
      )
      .sort({ totalSpent: -1 }) // sort descending by totalSpent
      .limit(10);
    // END OF TOP CUSTOMERS TABLE INFO

    // LOW STOCK TABLE INFO
    const dbProducts = await (Product as mongoose.Model<IProduct>)
      .find(
        {},
        {
          name: 1,
          images: 1,
          variants: 1,
          productCode: 1,
        }
      )
      .lean();

    const lowStockProducts = dbProducts.flatMap((product) =>
      product.variants
        .filter((variant) => variant.stock < 5) // Filter variants with low stock
        .map((variant) => ({
          name: product.name,
          variantName: variant.name,
          availableStocks: variant.stock,
          inStock: false,
          productCode: product.productCode,
          image: product.images?.[0] || "/images/default.png",
        }))
    );

    // END OF LOW STOCK TABLE INFO

    // ORDER STATUS BREAKDOWN PIE CHART INFO
    const orderStatusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);

    const total = orderStatusBreakdown.reduce(
      (sum, item) => sum + item.count,
      0
    );

    const COLORS = {
      pending: "#8884d8",
      shipped: "#82ca9d",
      delivered: "#ffc658",
      cancelled: "#ff7f50",
    };

    const formattedBreakdown = orderStatusBreakdown.map((item, index) => ({
      name: item.status,
      value: item.count,
      color: COLORS[item.status] || "#cccccc",
      percentage: ((item.count / total) * 100).toFixed(2) + "%",
    }));
    // END OF ORDER STATUS BREAKDOWN PIE CHART INFO

    // RECENT ORDER TABLE INFO
    const getRecentOrders = async () => {
      // Fetch raw orders from MongoDB, populate user name only
      const recentOrdersRaw = await (Order as mongoose.Model<IOrder>)
        .find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("user", "name email")
        .lean();

      // Map raw data to your desired format
      const recentOrders = recentOrdersRaw.map((order) => {
        const user = order.user as {
          email: string;
          name?: string;
        } | null;

        // Calculate total quantity
        const quantity = Array.isArray(order.items)
          ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
          : 0;

        return {
          id: order._id.toString(),
          orderId: order.orderId
            ? `#${order.orderId}`
            : `#${order._id.toString().slice(-6)}`,
          customer: {
            name: user?.name || "Unknown User",
            email: user?.email,
            avatar: "/avatars/default.jpg", // default avatar path
          },
          quantity,
          price: order.totalAmount || 0,
          status: order.status || "pending",
          orderedDate: order.createdAt,
        };
      });

      // Return a single object with recentOrders array inside
      return { recentOrders };
    };
    // END OF RECENT ORDER TABLE INFO

    // TOP SELLING PRODUCTS TABLE INFO
    const topSellingProductsInfo = async () => {
      const paidOrders = await (Order as mongoose.Model<IOrder>)
        .find({ paymentStatus: "paid" })
        .select("items");

      const salesMap = new Map();

      for (const order of paidOrders) {
        for (const item of order.items) {
          const key = `${item.product}_${item.variant}`;

          if (!salesMap.has(key)) {
            salesMap.set(key, {
              product: item.product,
              variant: item.variant,
              totalSales: 0,
            });
          }

          salesMap.get(key).totalSales += item.quantity;
        }
      }

      const salesArray = Array.from(salesMap.values());

      // Populate product + variant info
      const topProducts = await Promise.all(
        salesArray.map(async ({ product, variant, totalSales }) => {
          const productDoc = await (Product as mongoose.Model<IProduct>)
            .findById(product)
            .lean();
          if (!productDoc) return null;

          const variantInfo = productDoc.variants.find((v) =>
            v._id.equals(variant)
          );
          if (!variantInfo) return null;

          return {
            productId: product.toString(),
            variantId: variant.toString(),
            productName: productDoc.name,
            variantName: variantInfo.name,
            image: productDoc.images?.[0] || "/placeholder.png",
            mainCategory: productDoc.mainCategory,
            totalSales,
          };
        })
      );

      const filtered = topProducts.filter(Boolean);
      filtered.sort((a, b) => b.totalSales - a.totalSales);

      return filtered;
    };
    // END OF TOP SELLING PRODUCTS TABLE INFO

    // SALES REPORT CHART INFO
    const salesReport = async () => {
      const monthlyStats = await Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" }, // 1–12
            orders: { $sum: 1 },
            sales: { $sum: "$totalAmount" },
          },
        },
        {
          $sort: { _id: 1 }, // ✅ sort by month number
        },
        {
          $project: {
            month: {
              $let: {
                vars: {
                  monthsInString: [
                    "",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                },
                in: { $arrayElemAt: ["$$monthsInString", "$_id"] },
              },
            },
            orders: 1,
            sales: 1,
            _id: 0,
          },
        },
      ]);

      return monthlyStats;
    };

    // END OF SALES REPORT CHART INFO

    const result = {
      totalOrdersThisMonth,
      totalSalesThisMonth,
      registeredCustomers,
      change: {
        orderGrowth: {
          percentage: parseFloat(orderGrowth.percentage.toFixed(2)),
          impact: orderGrowth.impact,
        },
        salesGrowth: {
          percentage: parseFloat(salesGrowth.percentage.toFixed(2)),
          impact: salesGrowth.impact,
        },
        customerGrowth: {
          percentage: parseFloat(customerGrowth.percentage.toFixed(2)),
          impact: customerGrowth.impact,
        },
      },
      categoryData,
      topCustomers,
      lowStockInfo: lowStockProducts,
      orderStatusBreakdown: formattedBreakdown,
      recentOrders: await getRecentOrders(),
      topSellingProducts: await topSellingProductsInfo(),
      salesReport: await salesReport(),
    };

    // ✅ Cache the result
    cachedInsights = result;
    lastFetchTime = now;

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
