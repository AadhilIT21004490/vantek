import connectDB from "@/lib/db";
import Product from "@/lib/models/product";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  context: { params?: { id?: string } }
) => {
  try {
    if (!context.params || !context.params.id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const { id } = context.params;

    await connectDB();

    // ✅ Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id).populate("reviews.userId");
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
