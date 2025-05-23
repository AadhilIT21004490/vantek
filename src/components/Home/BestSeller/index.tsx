'use client'
import React, { useEffect, useState } from "react";
import SingleItem from "./SingleItem";
import Image from "next/image";
import Link from "next/link";
import shopData from "@/components/Shop/shopData";
import ProductItem from "@/components/Common/ProductItem";


//TODO : Fetch only best selling
const BestSeller = () => {

  const [products,setProducts] = useState([]); 
  
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products?topSellingProduct=true&limit=10");
        const data = await res.json();
    
        if (res.ok) {
          console.log("✅ Raw API Response:", data);
          setProducts(data.products);
          // setCurrentPage(data.currentPage)
          // setTotalPages(data.totalProducts)
        } else {
          console.error("❌ API Error:", data.message);
        }
      } catch (error) {
        console.error("❌ Fetch error:", error);
      }
    }
  
    useEffect(()=>{
      fetchData()
    },[])

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={17}
                height={17}
              />
              This Month
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              Best Sellers
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
          {/* <!-- Best Sellers item --> */}
          {products.slice(1, 7).map((item, key) => (
            // <SingleItem item={item} key={key} />
            <ProductItem item = {item} key = {key}/>
          ))}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop-with-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
