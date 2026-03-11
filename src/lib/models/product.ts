import mongoose, { model, models, Schema, Document } from "mongoose";

const mainCategories = ["VW-T6", "VW-T6.1", "VW-T7", "Universal Camper Parts"];

// Define Review Interface
export interface IReview {
  userId: mongoose.Types.ObjectId;
  rate: number;
  comment?: string;
  orderId: string;
  variantId: mongoose.Types.ObjectId;
  // productId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductVariant {
  _id: any;
  name: string;
  labelPrice: number;
  actualPrice: number;
  stock: number;
}

// Define Product Interface
export interface IProduct extends Document {
  productCode: string;
  name: string;
  description: string;
  mainCategory: "VW-T6" | "VW-T6.1" | "VW-T7" | "Universal Camper Parts";
  subCategory1: string;
  subCategory2: string;
  tags: string[];
  images: string[];
  variants: IProductVariant[];
  topSellingProduct: boolean;
  featuredProduct: boolean;
  isVisible: boolean;
  overAllRating: number;
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

// Separate schema for Reviews
const reviewSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rate: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    variantId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const variantSchema = new Schema({
  name: { type: String, required: true },
  labelPrice: { type: Number, required: true, min: 0 },
  actualPrice: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
});

const productSchema = new Schema(
  {
    productCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    mainCategory: {
      type: String,
      required: true,
      enum: mainCategories,
    },
    subCategory1: {
      type: String,
      required: true,
    },
    subCategory2: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 10, // Limit tags
        message: "Maximum 10 tags allowed",
      },
    },
    variants: { type: [variantSchema], required: true },
    images: {
      type: [String],
      required: true,
    },
    topSellingProduct: {
      type: Boolean,
      required: true,
      default: false,
    },
    featuredProduct: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVisible: {
      type: Boolean,
      required: true,
      default: true,
    },
    overAllRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Product = models.Product || model<IProduct>("Product", productSchema);
export default Product;
