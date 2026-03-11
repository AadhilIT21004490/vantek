import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import { isAdmin } from "@/lib/middleware";
import Product, { IProduct } from "@/lib/models/product";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// ✅ Extend serverless function timeout to 60s (default is 10s — too short for image uploads)
export const maxDuration = 60;

// ✅ Increase body size limit to 50MB for base64 images
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

// CREATE NEW PRODUCT
// POST /api/admin/product
export const POST = async (req: NextRequest) => {
  const isAdminMiddlewareResponse = await isAdmin(req);
  if (isAdminMiddlewareResponse) {
    return isAdminMiddlewareResponse;
  }
  try {
    await connectDB();

    // ✅ Verify Cloudinary is configured — env var names differ between dev and prod
    const cloudConfig = cloudinary.config();
    const isProd = process.env.NODE_ENV === "production";
    const cloudName = isProd ? process.env.CLOUDINARY_CLOUD_NAME_PRODUCTION : process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = isProd ? process.env.CLOUDINARY_API_KEY_PRODUCTION : process.env.CLOUDINARY_API_KEY;
    const apiSecret = isProd ? process.env.CLOUDINARY_API_SECRET_PRODUCTION : process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      const missing = [
        !cloudName && (isProd ? "CLOUDINARY_CLOUD_NAME_PRODUCTION" : "CLOUDINARY_CLOUD_NAME"),
        !apiKey && (isProd ? "CLOUDINARY_API_KEY_PRODUCTION" : "CLOUDINARY_API_KEY"),
        !apiSecret && (isProd ? "CLOUDINARY_API_SECRET_PRODUCTION" : "CLOUDINARY_API_SECRET"),
      ].filter(Boolean);
      console.error("❌ Missing Cloudinary env vars:", missing);
      return NextResponse.json(
        { success: false, message: `Missing env vars: ${missing.join(", ")}` },
        { status: 500 }
      );
    }

    const {
      productCode,
      name,
      description,
      variants,
      tags,
      mainCategory,
      subCategory1,
      subCategory2,
      images,
      topSellingProduct,
      featuredProduct,
    } = await req.json();

    // ✅ Validate required fields
    if (
      !productCode ||
      !name ||
      !description ||
      !variants?.length ||
      !mainCategory ||
      !subCategory1 ||
      !images?.length
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Validate variants
    const isVariantValid = variants.every(
      (variant: any) =>
        variant.name &&
        typeof variant.labelPrice === "number" &&
        typeof variant.actualPrice === "number" &&
        typeof variant.stock === "number"
    );

    if (!isVariantValid) {
      return NextResponse.json(
        { success: false, message: "Invalid or incomplete variant data" },
        { status: 400 }
      );
    }

    let imageUrls: string[] = [];

    // ✅ Upload images sequentially (not parallel) to avoid request timeout.
    //    Promise.all fires all uploads at once and can exceed the 60s limit
    //    with multiple large images. Sequential uploads are slower but reliable.
    if (images && images.length > 0) {
      try {
        for (const image of images) {
          const response = await cloudinary.uploader.upload(image, {
            folder: "products",
            resource_type: "auto",
            transformation: [
              {
                width: 1000,
                height: 1000,
                crop: "fit",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          });
          imageUrls.push(response.secure_url);
        }
      } catch (uploadError: any) {
        const errMsg = uploadError?.message || uploadError?.error?.message || JSON.stringify(uploadError);
        console.error("Cloudinary upload error (POST):", errMsg, uploadError);
        return NextResponse.json(
          { success: false, message: `Image upload failed: ${errMsg}` },
          { status: 500 }
        );
      }
    }

    // ✅ Create new product
    const newProduct = new Product({
      productCode,
      name,
      description,
      variants,
      tags,
      mainCategory,
      subCategory1,
      subCategory2,
      images: imageUrls,
      topSellingProduct,
      featuredProduct,
      isVisible: true,
    });

    await newProduct.save();
    return NextResponse.json(
      {
        success: true,
        product: newProduct,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /admin/product error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};

// UPDATE PRODUCT
// PATCH /api/admin/product
export const PATCH = async (req: NextRequest) => {
  const isAdminMiddlewareResponse = await isAdmin(req);
  if (isAdminMiddlewareResponse) {
    return isAdminMiddlewareResponse;
  }
  try {
    await connectDB();
    const {
      id,
      productCode,
      name,
      description,
      variantAdds = [],
      variantUpdates = [],
      variantDeletes = [],
      tags,
      mainCategory,
      subCategory1,
      subCategory2,
      deletedImages,
      newImages,
      action,
    } = await req.json();

    const product = await (Product as mongoose.Model<IProduct>).findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // ✅ Toggle Visibility
    if (action === "toggleVisibility") {
      product.isVisible = !product.isVisible;
      await product.save();
      return NextResponse.json(
        {
          success: true,
          product,
          message: `Product visibility updated to ${product.isVisible}`,
        },
        { status: 200 }
      );
    }

    // ✅ Toggle Top Selling
    else if (action === "toggleTopSelling") {
      product.topSellingProduct = !product.topSellingProduct;
      await product.save();
      return NextResponse.json(
        {
          success: true,
          product,
          message: `Product top selling status updated to ${product.topSellingProduct}`,
        },
        { status: 200 }
      );
    }

    // ✅ Toggle Featured
    else if (action === "toggleFeatured") {
      product.featuredProduct = !product.featuredProduct;
      await product.save();
      return NextResponse.json(
        {
          success: true,
          product,
          message: `Product featured status updated to ${product.featuredProduct}`,
        },
        { status: 200 }
      );
    }

    // ✅ Update product details
    else if (action === "updateDetails") {

      // Delete images from Cloudinary and product record
      if (deletedImages && deletedImages.length > 0) {
        for (const image of deletedImages) {
          try {
            // Extract public_id correctly — handles URLs with version numbers
            const urlParts = image.split("/");
            const folderIndex = urlParts.indexOf("products");
            const publicId =
              folderIndex !== -1
                ? "products/" + urlParts[folderIndex + 1].split(".")[0]
                : urlParts.pop()?.split(".")[0];

            await cloudinary.uploader.destroy(publicId);
            product.images = product.images.filter(
              (img: string) => img !== image
            );
          } catch (error) {
            console.error("Error deleting image from Cloudinary:", error);
            return NextResponse.json(
              { success: false, message: "Error deleting image" },
              { status: 500 }
            );
          }
        }
      }

      // Upload new images sequentially to avoid timeout
      if (newImages && newImages.length > 0) {
        try {
          for (const image of newImages) {
            const response = await cloudinary.uploader.upload(image, {
              folder: "products",
              resource_type: "auto",
              transformation: [
                {
                  width: 1000,
                  height: 1000,
                  crop: "fit",
                  quality: "auto",
                  fetch_format: "auto",
                },
              ],
            });
            product.images.push(response.secure_url);
          }
        } catch (uploadError: any) {
          const errMsg = uploadError?.message || uploadError?.error?.message || JSON.stringify(uploadError);
          console.error("Cloudinary upload error (PATCH):", errMsg);
          return NextResponse.json(
            { success: false, message: `Image upload failed: ${errMsg}` },
            { status: 500 }
          );
        }
      }

      // Update core product fields
      product.name = name || product.name;
      product.productCode = productCode || product.productCode;
      product.description = description || product.description;
      product.tags = tags || product.tags;
      product.mainCategory = mainCategory || product.mainCategory;
      product.subCategory1 = subCategory1 || product.subCategory1;
      product.subCategory2 = subCategory2 ?? product.subCategory2;

      // Add new variants
      if (variantAdds && variantAdds.length > 0) {
        for (const newVariant of variantAdds) {
          if (
            newVariant.name &&
            typeof newVariant.labelPrice === "number" &&
            typeof newVariant.actualPrice === "number" &&
            typeof newVariant.stock === "number"
          ) {
            product.variants.push(newVariant);
          }
        }
      }

      // Update existing variants
      if (variantUpdates && variantUpdates.length > 0) {
        product.variants = product.variants.map((existingVariant: any) => {
          const update = variantUpdates.find(
            (v: any) => String(v._id) === String(existingVariant._id)
          );
          return update
            ? {
                ...existingVariant.toObject(),
                name: update.name ?? existingVariant.name,
                labelPrice: update.labelPrice ?? existingVariant.labelPrice,
                actualPrice: update.actualPrice ?? existingVariant.actualPrice,
                stock: update.stock ?? existingVariant.stock,
              }
            : existingVariant;
        });
      }

      // Delete variants by _id
      if (variantDeletes && variantDeletes.length > 0) {
        product.variants = product.variants.filter(
          (variant: any) => !variantDeletes.includes(String(variant._id))
        );
      }

      await product.save();

      return NextResponse.json(
        {
          success: true,
          product,
          message: "Product updated successfully",
        },
        { status: 200 }
      );
    }

    else {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("PATCH /admin/product error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};