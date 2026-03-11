"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import {
  CreditCard,
  Heart,
  PackageCheck,
  RefreshCcw,
  Share2,
  ShieldCheck,
  Store,
  Truck,
  Plus,
  Minus,
  ThumbsUp,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import {
  addItemToWishlist,
  removeItemFromWishlist,
} from "@/redux/features/wishlist-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { generateAvatarUrl } from "@/helper/generateAvatarUrl";
import PreLoader from "../Common/PreLoader";
import { toast } from "sonner";
import { formatToEuro } from "@/helper/formatCurrencyToEuro";

const ShopDetails = ({ productId }: { productId: string }) => {
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const wishlist = useSelector(
    (state: RootState) => state.wishlistReducer.items
  );
  const maxStock = 10;
  const currentStock = product?.variants[selectedVariantIndex]?.stock ?? 0;
  const stockPercentage = Math.min((currentStock / maxStock) * 100, 100);
  const isInWishlist = wishlist.some(
    (wishItem) => wishItem._id === product?._id
  );

  {
    product && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: product.images,
            description: product.description
              ?.replace(/<[^>]*>?/gm, "")
              .slice(0, 160),
            sku: product.productCode,
            brand: {
              "@type": "Brand",
              name: "Vantek",
            },
            aggregateRating: product.overAllRating
              ? {
                  "@type": "AggregateRating",
                  ratingValue: product.overAllRating.toFixed(1),
                  reviewCount: product.reviews.length,
                }
              : undefined,
            offers: product.variants.map((variant: any) => ({
              "@type": "Offer",
              url: `${process.env.NEXT_PUBLIC_BASEURL}/shop-details/${product._id}`,
              priceCurrency: "GBP",
              price: variant.actualPrice,
              priceValidUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              itemCondition: "https://schema.org/NewCondition",
              availability:
                variant.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              sku: variant._id,
            })),
            review: product.reviews.slice(0, 3).map((review: any) => ({
              "@type": "Review",
              author: {
                "@type": "Person",
                name: "Ahamed Aathil Junain",
              },
              datePublished: review.createdAt,
              reviewBody: review.comment || "",
              reviewRating: {
                "@type": "Rating",
                ratingValue: review.rate,
              },
            })),
          }),
        }}
      />
    );
  }

  const handleIncrement = () =>
    setQuantity((prev) =>
      prev < product?.variants?.[selectedVariantIndex].stock ? prev + 1 : prev
    );
  const handleDecrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handlePreviewSlider = () => {
    openPreviewModal();
  };

  const handleShare = async () => {
    if (!product || !product.name) {
      toast.error("Product information is unavailable.");
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          text: `Check out this amazing product on Vantek: ${product.name}\n${window.location.href}`,
        });
      } catch (err) {
        console.error("Sharing failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.info("Link copied to clipboard!");
      } catch (err) {
        console.error("Clipboard write failed:", err);
        toast.error("Failed to copy link to clipboard.");
      }
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    try {
      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/cart`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id,
            userId: user?._id,
            variantId: product?.variants?.[selectedVariantIndex]._id,
            quantity: quantity,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add to cart!");
      }

      const payload = {
        _id: product._id,
        name: product.name,
        actualPrice: product?.variants?.[selectedVariantIndex].actualPrice,
        quantity: quantity,
        images: product.images[0],
        variantId: product?.variants?.[selectedVariantIndex]._id,
      };

      dispatch(addItemToCart(payload));
      toast.success("Item added to cart successfully!");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleItemToWishList = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    const isInWishlist = wishlist.some(
      (wishItem) => wishItem._id === product._id
    );

    if (isInWishlist) {
      dispatch(removeItemFromWishlist(product._id));
      toast.info("Item removed from wishlist!");
    } else {
      dispatch(addItemToWishlist(product));
      toast.success("Item added to wishlist!");
    }

    try {
      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/products/wishlist`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to toggle wishlist state!");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NODE_ENV === "production"
              ? process.env.NEXT_PUBLIC_BASEURL
              : process.env.NEXT_PUBLIC_BASEURL_LOCAL
          }/products/${productId}`
        );
        const data = await res.json();

        if (res.ok) {
          setProduct(data.product);
        } else {
          console.error("Failed to load product:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <>
      {loading && <PreLoader />}
      <Breadcrumb title={"Product Details"} pages={["shop details"]} />

      {product?.name === "" ? (
        "Please add products"
      ) : (
        <>
          <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white">
            {/* Column 1 - Product Images */}
            <div className="space-y-4">
              {/* ✅ Main image: clickable to open full-screen lightbox */}
              <div
                className="border rounded-xl overflow-hidden bg-white flex items-center justify-center cursor-zoom-in relative group"
                style={{ height: "380px" }}
                onClick={() => setLightboxOpen(true)}
              >
                {product?.images?.[previewImg] ? (
                  <>
                    <Image
                      src={product.images[previewImg]}
                      alt={product.name || "Product image"}
                      width={500}
                      height={500}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Hover hint */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white text-xs px-3 py-1 rounded-full transition-opacity duration-300">
                        Click to expand
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>

              {/* ✅ Thumbnails: also object-contain so they match the main image behaviour */}
              <div className="flex gap-2 flex-wrap">
                {product?.images?.map((img: string, index: number) => (
                  <div
                    key={index}
                    className={`border rounded-xl overflow-hidden w-20 h-20 cursor-pointer bg-white flex items-center justify-center ${
                      index === previewImg ? "ring-2 ring-green-500" : ""
                    }`}
                    onClick={() => setPreviewImg(index)}
                  >
                    <Image
                      src={img}
                      alt={product.name || `Thumbnail ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"  // ✅ object-contain on thumbnails too
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 - Product Info */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {product?.name}
              </h2>
              <div className="flex justify-between items-center gap-2 text-sm">
                <span className="text-gray-600">
                  ⭐ {product?.overAllRating} Rating ({product?.reviews?.length}{" "}
                  Reviews)
                </span>
                <span className="font-semibold text-gray-900">
                  SKU : {product?.productCode}
                </span>
              </div>
              <div
                className="prose prose-sm max-w-none text-gray-800 line-clamp-5"
                dangerouslySetInnerHTML={{ __html: product?.description }}
              ></div>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-3xl font-bold text-green-600">
                  {formatToEuro(
                    product?.variants[selectedVariantIndex]?.actualPrice
                  )}
                </div>
                <div className="text-sm line-through text-gray-400">
                  {formatToEuro(
                    product?.variants[selectedVariantIndex]?.labelPrice
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block mb-1 text-sm text-gray-700 font-medium">
                  Select Variant
                </label>
                <select
                  className="p-2 rounded bg-gray-100 text-gray-700 w-full"
                  value={product?.variants[selectedVariantIndex]?.name}
                  onChange={(e) => {
                    const selectedIndex = product?.variants.findIndex(
                      (v: any) => v.name === e.target.value
                    );
                    setSelectedVariantIndex(
                      selectedIndex !== -1 ? selectedIndex : 0
                    );
                    setQuantity(1);
                  }}
                >
                  {product?.variants?.map((variant: any, index: number) => (
                    <option key={variant._id || index} value={variant.name}>
                      {variant.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-2">
                <span className="block mb-1 text-sm text-gray-700 font-medium">
                  Select Quantity
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDecrement}
                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-medium w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stockPercentage}%` }}
                ></div>
              </div>

              <div className="text-sm text-gray-600">
                Stock Available:{" "}
                {product?.variants[selectedVariantIndex]?.stock ?? 0}
              </div>

              <div className="flex items-center mt-4 gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product?.variants[selectedVariantIndex]?.stock <= 0}
                  className={`px-4 py-2 rounded-md text-white transition duration-200 ${
                    product?.variants[selectedVariantIndex]?.stock > 0
                      ? "bg-green-500 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {product?.variants[selectedVariantIndex]?.stock > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>

                <button
                  onClick={() => handleItemToWishList()}
                  className="bg-blue-100 text-blue-500 border-hidden border-blue-500 px-4 py-2 rounded-md hover:bg-blue-700 hover:text-white"
                >
                  <Heart
                    color={isInWishlist ? "red" : "#dbeafe"}
                    fill={isInWishlist ? "red" : "white"}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="bg-amber-100 text-amber-500 border-hidden border-green-500 px-4 py-2 rounded-md hover:bg-amber-500 hover:text-white"
                >
                  <Share2 />
                </button>
              </div>
            </div>

            {/* Column 3 - Why Choose Us */}
            <div className="space-y-4 bg-green-50 p-4 rounded-xl border border-gray-200">
              <div className="bg-blueGray-800 p-2 rounded-full flex justify-center">
                <h3 className="text-xl font-semibold text-white">
                  Why you choose us?
                </h3>
              </div>
              <hr />
              <div className="flex items-start gap-3">
                <div className="bg-white p-1 rounded-full">
                  <Truck className="text-green-500" />
                </div>
                <p className="text-sm text-gray-700">
                  Fast Delivery - Lightning-fast shipping, guaranteed.
                </p>
              </div>
              <hr />
              <div className="flex items-start gap-3">
                <div className="bg-white p-1 rounded-full">
                  <RefreshCcw className="text-green-500" />
                </div>
                <p className="text-sm text-gray-700">
                  Free 90-day returns - Shop risk-free with easy returns.
                </p>
              </div>
              <hr />
              <div className="flex items-start gap-3">
                <div className="bg-white p-1 rounded-full">
                  <Store className="text-green-500" />
                </div>
                <p className="text-sm text-gray-700">
                  Pickup available at Shop location - Usually ready in 24 hours.
                </p>
              </div>
              <hr />
              <div className="flex items-start gap-3">
                <div className="bg-white p-1 rounded-full">
                  <CreditCard className="text-green-500" />
                </div>
                <p className="text-sm text-gray-700">
                  Multiple Payment Options - Card, Google Pay, Online payment.
                </p>
              </div>
              <hr />
              <div className="flex items-start gap-3">
                <div className="bg-white p-1 rounded-full">
                  <ShieldCheck className="text-green-500" />
                </div>
                <p className="text-sm text-gray-700">
                  Warranty - Covered under Consumer Protection Act.
                </p>
              </div>
              <hr />
              <div className="flex items-start gap-3">
                <div className="bg-white p-1 rounded-full">
                  <PackageCheck className="text-green-500" />
                </div>
                <p className="text-sm text-gray-700">
                  Secure Packaging - High-quality packaging ensured.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-[1170px] mx-auto px-4 mt-10 p-6 border bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-4 py-2 rounded-t-md font-semibold transition ${
                    activeTab === "description"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-4 py-2 rounded-t-md font-semibold transition ${
                    activeTab === "reviews"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Reviews
                </button>
              </div>

              {product?.overAllRating > 2 && (
                <div className="flex items-center ml-1 space-x-2 text-green-600 text-sm font-semibold">
                  <ThumbsUp size={16} />
                  <span>
                    {(product?.overAllRating / 5) * 100}% Satisfaction
                    Guaranteed
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 text-gray-800 leading-relaxed">
              {activeTab === "description" ? (
                <div
                  className="prose prose-sm max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: product?.description }}
                ></div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Customer Reviews
                  </h3>

                  {product?.reviews?.length > 0 ? (
                    product?.reviews?.map((review) => (
                      <div
                        key={review._id}
                        className="mb-6 border-b border-gray-200 pb-4"
                      >
                        <div className="flex items-center mb-1">
                          <span className="font-semibold">
                            <Image
                              src={generateAvatarUrl(review?.userId?.email)}
                              alt={review?.userId?.name || "User Avatar"}
                              width={24}
                              height={24}
                              className="inline-block rounded-full mr-2"
                            />{" "}
                            {review?.userId?.name}
                          </span>
                          <span className="ml-3 text-yellow-500">
                            {"★".repeat(review?.rate) +
                              "☆".repeat(5 - review?.rate)}
                          </span>
                        </div>
                        <p className="italic text-gray-700">
                          {review?.comment}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(review?.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 italic">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ✅ Lightbox - full screen image preview */}
      {lightboxOpen && product?.images?.length > 0 && (
        <div
          className="fixed inset-0 z-[999] bg-gray-500/60 backdrop-blur-md flex items-center justify-center"
          onClick={() => setLightboxOpen(false)} // click backdrop to close
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/25 text-white p-2 rounded-full transition"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={24} />
          </button>

          {/* Prev arrow */}
          {product.images.length > 1 && (
            <button
              className="absolute left-4 bg-white/10 hover:bg-white/25 text-white p-2 rounded-full transition"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImg((prev) =>
                  prev === 0 ? product.images.length - 1 : prev - 1
                );
              }}
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Main lightbox image — stop propagation so clicking image doesn't close */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={product.images[previewImg]}
              alt={product.name || "Product image"}
              width={1200}
              height={1200}
              className="object-contain max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            />
          </div>

          {/* Next arrow */}
          {product.images.length > 1 && (
            <button
              className="absolute right-4 bg-white/10 hover:bg-white/25 text-white p-2 rounded-full transition"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImg((prev) =>
                  prev === product.images.length - 1 ? 0 : prev + 1
                );
              }}
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Thumbnail strip at bottom */}
          {product.images.length > 1 && (
            <div
              className="absolute bottom-4 flex gap-2 justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {product.images.map((img: string, index: number) => (
                <div
                  key={index}
                  onClick={() => setPreviewImg(index)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                    index === previewImg
                      ? "border-green-400 scale-110"
                      : "border-white/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain bg-white"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShopDetails;