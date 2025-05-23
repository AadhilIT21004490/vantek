import React from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { addItemToWishlist, removeItemFromWishlist } from "@/redux/features/wishlist-slice";

import { addItemToCart } from "@/redux/features/cart-slice";

import Image from "next/image";
import { XCircle } from "lucide-react";

const SingleItem = ({ item }) => {
  const wishlist = useSelector(
    (state: RootState) => state.wishlistReducer.items
  );
  const user = useSelector((state: RootState) => state.auth.user); // ✅ Get user from Redux
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  // const handleRemoveFromWishlist = () => {
  //   dispatch(removeItemFromWishlist(item._id));
  // };

    const handleRemoveFromWishlist = async () => {
        if (!user){
          router.push('/signin')
          return
        }
        // Optimistically update the Redux state
        const isInWishlist = wishlist.some((wishItem) => wishItem._id === item?._id);
    
        if (isInWishlist) {
          // Remove from wishlist if item already exists
          dispatch(removeItemFromWishlist(item?._id));
        } else {
          // Add to wishlist if item doesn't exist
          dispatch(addItemToWishlist(item));
        }
    
        try {
          const res = await fetch("http://localhost:3000/api/products/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item?._id,
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

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
      })
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center border-t border-gray-3 py-4 px-4 sm:px-6 md:px-10 gap-4 sm:gap-0">
      {/* Remove Button */}
      <div className="self-start sm:self-center">
        <button
          onClick={handleRemoveFromWishlist}
          aria-label="Remove from wishlist"
          className="flex items-center justify-center rounded-lg w-9 h-9 bg-gray-2 border border-gray-3 hover:bg-red-100 hover:border-red-300 hover:text-red"
        >
          <XCircle />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-1/2" >
        <div className="w-20 h-20 ml-4 bg-gray-2 rounded-md flex items-center justify-center overflow-hidden hover:cursor-pointer">
          <Image
            src={item?.images?.[0]}
            alt={item?.name || "Product"}
            width={80}
            height={80}
            className="object-contain"
            onClick={() => router.push(`/shop-details/${item?._id}`)}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-dark hover:text-blue" onClick={() => router.push(`/shop-details/${item?._id}`)}>
            <a href="#">{item?.name}</a>
          </h3>
        </div>
      </div>

      {/* Price */}
      <div className="w-full sm:w-1/2 text-sm text-dark sm:text-left mt-2 sm:mt-0">
        ${item?.variants?.[0]?.actualPrice || "0.00"}
      </div>
    </div>
  );
};

export default SingleItem;
