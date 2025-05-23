import { NextRequest, NextResponse } from "next/server";

import Wishlist, { IWishlist } from "@/lib/models/wishlist";
import connectDB from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import User, { IUser } from "@/lib/models/user";
import mongoose from "mongoose";

// TOGGLE PRODUCT IN WISHLIST
// POST /api/products/wishlist
export const POST = async (req: NextRequest) => {
  const { productId } = await req.json();
  let state = "";
  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required", success: false },
      { status: 400 }
    );
  }
  const authMiddlewareResponse = await authMiddleware(req);
  if (authMiddlewareResponse) {
    return authMiddlewareResponse;
  }

  try {
    await connectDB();
    const userId = req.headers.get("userId") as string;
    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated", success: false },
        { status: 401 }
      );
    }

    const wishlist = await (Wishlist as mongoose.Model<IWishlist>).findOne({
      user: userId,
    });

    const user = await (User as mongoose.Model<IUser>)
      .findById(userId)
      .select("_id wishlist");

    if (wishlist) {
      const isProductInWishlist = wishlist.products.includes(productId);
      if (isProductInWishlist) {
        // Remove product from wishlist
        wishlist.products = wishlist.products.filter(
          (product) => product.toString() !== productId.toString()
        );
        await wishlist.save();
        state = "removed from";
      } else {
        // Add product to wishlist
        wishlist.products.push(productId);
        await wishlist.save();
        state = "added in";
      }
    } else {
      const newWishlist = new Wishlist({
        user: userId,
        products: [productId],
      });
      await newWishlist.save();
      user.wishlist = newWishlist._id;
      await user.save();
      state = "added in";
    }
    const user_wishlist = await (Wishlist as mongoose.Model<IWishlist>)
      .findOne({ user: userId })
      .select("products")
      .populate("products");
    return NextResponse.json(
      { message: `Product ${state} wishlist`, data: user_wishlist, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while toggling product in wishlist",
        success: false,
        error: error,
      },
      { status: 500 }
    );
  }
};

// VIEW WISHLIST
// GET /api/products/wishlist
export const GET = async (req: NextRequest) => {
  const authMiddlewareResponse = await authMiddleware(req);
  if (authMiddlewareResponse) {
    return authMiddlewareResponse;
  }
  try {
    await connectDB();
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          success: false,
        },
        { status: 401 }
      );
    }
    const wishlist = await (Wishlist as mongoose.Model<IWishlist>)
      .findOne({ user: userId })
      .select("products")
      .populate("products");
    if (!wishlist) {
      return NextResponse.json(
        {
          message: "No wishlist exist",
          success: false,
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        data: wishlist,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while fetching wishlist",
        success: false,
        error: error,
      },
      { status: 500 }
    );
  }
};
