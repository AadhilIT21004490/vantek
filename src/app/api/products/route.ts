import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product, { IProduct } from "@/lib/models/product";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();

    // ✅ Extract query params from the request URL
    const { searchParams } = new URL(req.url);
    const page: number = parseInt(searchParams.get("page")) || 1;
    const limit: number = parseInt(searchParams.get("limit")) || 10;
    const search: string = searchParams.get("search") || "";
    const category: string = searchParams.get("category") || "";
    const minPrice: number = parseFloat(searchParams.get("minPrice")) || 0;
    const maxPrice: number =
      parseFloat(searchParams.get("maxPrice")) || Number.MAX_VALUE;
    const minRating: number = parseFloat(searchParams.get("minRating")) || 0;
    const stockAvailable: boolean =
      searchParams.get("stockAvailable") === "true"; // If true, filter only available stock

    // ✅ Build Query Object
    let query = {} as Record<string, any>;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.mainCategory = category;
    if (minPrice || maxPrice)
      query["variants.actualPrice"] = { $gte: minPrice, $lte: maxPrice };
    if (minRating) query["reviews.rate"] = { $gte: minRating };
    if (stockAvailable) query["variants.stock"] = { $gt: 0 }; // Only products with stock > 0

    // ✅ Get total count for pagination
    const totalProducts = await Product.countDocuments(query);

    // ✅ Fetch filtered products with pagination
    const products = await (Product as mongoose.Model<IProduct>)
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }); // Latest products first

    return NextResponse.json({
      success: true,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
