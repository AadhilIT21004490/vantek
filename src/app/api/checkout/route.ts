import generateUniqueOrderId from "@/helper/generateOrderId";
import connectDB from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import CarouselItem, { ICarouselItem } from "@/lib/models/carousel";
import Cart, { ICart } from "@/lib/models/cart";
import Order, { IOrder } from "@/lib/models/order";
import Product, { IProduct } from "@/lib/models/product";
import User, { IUser } from "@/lib/models/user";
import mongoose, { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  // ✅ Use the authMiddleware to check if the request is authenticated
  const authMiddlewareResponse = await authMiddleware(req);
  if (authMiddlewareResponse) {
    return authMiddlewareResponse;
  }
  try {
    await connectDB();
    // get current user id and role and verify with response data
    const currentUserId = req.headers.get("userId");
    const role = req.headers.get("role");

    if (!currentUserId) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          success: false,
        },
        { status: 401 }
      );
    }

    if (role !== "user") {
      return NextResponse.json(
        {
          message: "Admin can't checkout",
          success: false,
        },
        { status: 401 }
      );
    }

    // get data from frontend
    const {
      userId,
      items,
      isUk,
      couponCode,
      shippingMethod,
      deliveryNote,
      shippingAddress,
    } = await req.json();

    console.log("shippingAddress in backend:", shippingAddress);

    // validate inputs and exists
    if (!userId) {
      return NextResponse.json(
        {
          message: "User ID is required",
          success: false,
        },
        { status: 400 }
      );
    }

    // makesure user is authenticated
    if (currentUserId !== userId) {
      return NextResponse.json(
        {
          message: "Illegal Attempt",
          success: false,
        },
        { status: 401 }
      );
    }

    if (!items) {
      return NextResponse.json(
        {
          message: "Items are required",
          success: false,
        },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        {
          message: "Shipping address is required",
          success: false,
        },
        { status: 400 }
      );
    }

    // makesure user is authenticated
    if (role !== "user") {
      return NextResponse.json(
        {
          message: "Admin can't checkout",
          success: false,
        },
        { status: 401 }
      );
    }

    // Normalize items to always be an array
    const itemsArray = Array.isArray(items) ? items : [items];

    // STEP1 - calculate the total Amount
    let totalAmount = 0;
    const processedItems = [];

    // If itemsArray looks like [{ items: [...] }], then:
    const rawItems = itemsArray[0]?.items || [];
    // console.log("rawItems:", rawItems);

    for (const item of rawItems) {
      const { product: productId, variant: variantId, quantity } = item;

      // Find product by ID
      const product = await (Product as mongoose.Model<IProduct>).findById(
        productId
      );
      if (!product) {
        return NextResponse.json(
          { message: `Product with id ${productId} not found`, success: false },
          { status: 400 }
        );
      }

      if (!product.isVisible) {
        return NextResponse.json(
          {
            message: `Product ${product.name} is Currently Unavailable, Please Remove it from your Cart`,
            success: false,
          },
          { status: 400 }
        );
      }

      // Find variant inside product variants
      const variant = product.variants.find(
        (v) => v._id.toString() === variantId
      );
      if (!variant) {
        return NextResponse.json(
          {
            message: `Variant with id ${variantId} not found in product ${productId}`,
            success: false,
          },
          { status: 400 }
        );
      }

      // ✅ Check if variant has enough stock
      if (variant.stock < quantity) {
        return NextResponse.json(
          {
            message: `Not enough stock for variant "${variant.name}" of product "${product.name}". Requested: ${quantity}, Available: ${variant.stock}`,
            success: false,
          },
          { status: 400 }
        );
      }

      // Calculate price * quantity
      const price = variant.actualPrice;
      const itemTotal = price * quantity;

      totalAmount += itemTotal;

      // Push processed item with price info
      processedItems.push({
        product: product._id,
        variant: variant._id,
        quantity,
        price,
      });
    }
    // STEP2 - calculate the shipping fee
    let shippingFee = 0;

    if (isUk) {
      if (totalAmount < 150) {
        if (shippingMethod === "express") {
          shippingFee = 8.5;
        } else if (shippingMethod === "standard") {
          shippingFee = 4.5;
        }
      }
    } else {
      // Do nothing; the client will contact the user manually.
      shippingFee = 0;
    }

    // STEP3- calculate the total amount with shipping fee
    totalAmount += shippingFee;

    // STEP4- append user address details with user
    await (User as mongoose.Model<IUser>).findByIdAndUpdate(
      userId,
      {
        $set: {
          address: [shippingAddress], // Overwrite entire address array with new one
        },
      },
      { new: true }
    );

    // STEP5- Create the order
    const order = new (Order as mongoose.Model<IOrder>)({
      orderId: await generateUniqueOrderId(),
      user: userId,
      items: processedItems,
      totalAmount,
      isUK: isUk,
      couponCode,
      shippingMethod,
      deliveryNote,
      shippingAddress,
      status: "pending",
      paymentMethod: "paypal",
      paymentStatus: "unpaid",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // STEP6- apply coupon if provided

    let discount = 0;
    let isCouponApplied = false;
    let coupon: ICarouselItem | null = null;
    if (couponCode) {
      coupon = await (CarouselItem as mongoose.Model<ICarouselItem>).findOne({
        code: couponCode,
        isActive: true,
      });

      if (!coupon) {
        return NextResponse.json(
          { message: "Invalid coupon code", success: false },
          { status: 400 }
        );
      }

      const now = new Date();

      if (coupon.startDate && now < coupon.startDate) {
        return NextResponse.json(
          { message: "Coupon not active yet", success: false },
          { status: 400 }
        );
      }

      if (coupon.endDate && now > coupon.endDate) {
        return NextResponse.json(
          { message: "Coupon expired", success: false },
          { status: 400 }
        );
      }

      if (coupon.usedBy?.some((id) => id.toString() === userId)) {
        return NextResponse.json(
          { message: "You have already used this coupon", success: false },
          { status: 400 }
        );
      }

      // Apply the discount
      discount = (totalAmount * (coupon.percentage || 0)) / 100;
      totalAmount = totalAmount - discount;

      // Mark the coupon as used by this user
      if (!isValidObjectId(userId)) {
        return NextResponse.json(
          { message: "Invalid user ID", success: false },
          { status: 400 }
        );
      }
      await (CarouselItem as mongoose.Model<ICarouselItem>).updateOne(
        { _id: coupon._id },
        { $push: { usedBy: userId } }
      );

      isCouponApplied = true;
      order.couponCode = couponCode;
      order.totalAmount = totalAmount;
      order.discountAmount = discount;
    }

    await order.save();

    // STEP7- return the order details
    return NextResponse.json({
      message: "Order validated and placed successfully",
      success: true,
      order,
      userId,
      orderId: order.orderId,
      shippingFee,
      totalAmount,
      discount,
      isCouponApplied,
      appliedCoupon: coupon
        ? { code: coupon.code, percentage: coupon.percentage }
        : null,
      items: processedItems,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
};
