"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import {
  addItemToWishlist,
  removeItemFromWishlist,
} from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import { Eye, Heart, Star } from "lucide-react";
import { useRouter } from "next/navigation";


const ProductItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const wishlist = useSelector(
    (state: RootState) => state.wishlistReducer.items
  );

  const isInWishlist = wishlist.some((wishItem) => wishItem._id === item._id);

  // console.log("wishlist========",wishlist)

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // add to cart
  // const handleAddToCart = () => {
  //   dispatch(
  //     addItemToCart({
  //       ...item,
  //       quantity: 1,
  //     })
  //   );
  // };

  const handleItemToWishList = async () => {
    if (!user){
      router.push('/signin')
      return
    }
    // Optimistically update the Redux state
    const isInWishlist = wishlist.some((wishItem) => wishItem._id === item._id);

    if (isInWishlist) {
      // Remove from wishlist if item already exists
      dispatch(removeItemFromWishlist(item._id));
    } else {
      // Add to wishlist if item doesn't exist
      dispatch(addItemToWishlist(item));
    }

    try {
      const res = await fetch("http://localhost:3000/api/products/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to toggle product state!");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleProductDetails = () => {
    dispatch(updateproductDetails({ ...item }));
  };

  return (
    <div className="group">
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-[#F6F7FB] min-h-[270px] mb-4 shadow-3">
        <Image src={item?.images[0]} alt="" width={250} height={250} />

        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
          <button
            onClick={() => {
              openModal();
              handleQuickViewUpdate();
            }}
            id="newOne"
            aria-label="button for quick view"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
          >
            <Eye size={16} />
          </button>

          <button
            onClick={() => router.push(`/shop-details/${item?._id}`)}
            className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark"
          >
            View Product
          </button>

          <button
            // disabled = {!user}
            onClick={() => handleItemToWishList()}
            aria-label="button for favorite select"
            id="favOne"
            className=" flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
          >
            <Heart
              size={16}
              color={isInWishlist ? "red" : "gray"}
              fill={isInWishlist ? "red" : "white"}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex items-center gap-1">
          <Star size={16} color="gold" fill="gold" />
        </div>

        <p className="text-custom-sm">
          {item.overAllRating} ({item.reviews.length} Reviews)
        </p>
      </div>

      <h3
        className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5"
        onClick={() => handleProductDetails()}
      >
        <Link href={`/shop-details/${item._id}`}> {item.name} </Link>
      </h3>

      <span className="flex items-center gap-2 font-medium text-lg">
        <span className="text-dark">${item.variants[0].actualPrice}</span>
        <span className="text-dark-4 line-through">
          ${item.variants[0].labelPrice}
        </span>
      </span>
    </div>
  );
};

export default ProductItem;
