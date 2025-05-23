"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {fetchWishlistHelper} from '@/helper/getWishlistHelper'
import { setWishlist } from "@/redux/features/wishlist-slice";


export const Wishlist = () => {
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
   const user = useSelector((state: RootState) => state.auth.user); // ✅ Get user from Redux
    const dispatch = useDispatch();
     useEffect(() => {
       fetchWishlistHelper(user,dispatch,setWishlist);
    }, []);

  return (
    <>
      <Breadcrumb title={"Wishlist"} pages={["Wishlist"]} />
      <section className="w-full overflow-x-auto py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">Your Wishlist</h2>
            <button className="text-blue">Clear Wishlist Cart</button>
          </div>

          <div className="bg-white rounded-[10px] shadow-1">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1170px]">
                {/* <!-- table header --> */}
                <div className="hidden sm:flex items-center py-5.5 px-4 sm:px-6 md:px-10 border-b border-gray-200">
                  <div className="w-1/2">
                    <p className="text-dark font-medium">Product</p>
                  </div>
                  <div className="w-1/2">
                    <p className="text-dark font-medium">Price</p>
                  </div>
                </div>

                {/* <!-- Wishlist items --> */}
                {wishlistItems.length > 0 ? (
                  wishlistItems.map((item, key) => (
                    <SingleItem item={item} key={key} />
                  ))
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    No items in your wishlist.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
