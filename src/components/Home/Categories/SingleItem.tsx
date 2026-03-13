import { Category } from "@/types/category";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setApiUrl } from "@/redux/features/shopFilter-slice";

const SingleItem = ({ item }: { item: Category }) => {
  const dispatch = useDispatch();
  const handleClick = (item) => {
    dispatch(setApiUrl(item.apiUrl));
  };

  return (
    <Link
      href={item.apiUrl}
      onClick={() => handleClick(item)}
      className="group flex flex-col items-center px-1"
    >
      <div className="w-[70px] h-[70px] bg-[#F2F3F8] rounded-full flex items-center justify-center mb-2 sm:w-[100px] sm:h-[100px] sm:mb-4">
        <Image
          src={item.img}
          alt={item.title}
          width={50}
          height={50}
          className="object-contain sm:w-[70px] sm:h-[70px]"
        />
      </div>

      <div className="flex justify-center text-center">
        <h3 className="text-xs sm:text-sm font-medium text-dark group-hover:text-blue transition-colors duration-300">
          {item.title}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;
