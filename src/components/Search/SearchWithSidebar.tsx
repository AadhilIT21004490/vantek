/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "../ShopWithSidebar/CustomSelect";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import {
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
} from "lucide-react";
import SidebarShop from "../ShopWithSidebar/SidebarShop";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";

const SearchWithSidebar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get query params
  const search = searchParams.get("search") || "";
  const mainCategory = searchParams.get("mainCategory") || "";

  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [resetSidebar, setResetSidebar] = useState(false); //clear side bar props

  // Product data and pagination
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Cache expiry and key builder
  const CACHE_EXPIRY_MS = 1000 * 60 * 30; // 30 minutes

  const buildCacheKey = (
    page: number,
    filters: Record<string, string[]>,
    search: string,
    mainCategory: string
  ) => {
    const filterKey = JSON.stringify(filters);
    return `search_cache_${search}_${mainCategory}_page_${page}_filters_${filterKey}`;
  };

  const clearAllFilters = () => {
    setCurrentPage(1);

    const newParams = new URLSearchParams(); // Empty params
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  // Fetch products based on search, mainCategory, page, and filters
  const fetchData = async (page = 1) => {
    if (page < 1) page = 1;

    const cacheKey = buildCacheKey(page, {}, search, mainCategory);

    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
          setProducts(data.products);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
          setTotalProducts(data.totalProducts);
          return;
        }
      } catch {
        console.warn("Invalid cache, fetching fresh");
      }
    }

    try {
      const searchQuery = new URLSearchParams(searchParams.toString());
      searchQuery.set("page", String(page));

      if (search) searchQuery.set("search", search);
      // Main category is part of searchParams already if set via URL, but we ensure it override
      if (mainCategory) searchQuery.set("mainCategory", mainCategory);

      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/products?${searchQuery.toString()}`
      );
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products || []);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            timestamp: Date.now(),
            data,
          })
        );
      } else {
        console.error("API Error:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Fetch data when search, URL params, or page changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search or filter changes
  }, [searchParams]);

  useEffect(() => {
    fetchData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, currentPage]);

  // Sticky menu on scroll
  useEffect(() => {
    const handleStickyMenu = () => {
      setStickyMenu(window.scrollY >= 80);
    };
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  // Close sidebar if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productSidebar]);

  const options = [
    { label: "Latest Products", value: "0" },
    { label: "Best Selling", value: "1" },
    { label: "Old Products", value: "2" },
  ];

  return (
    <>
      <Breadcrumb title={`Search Results for "${search}"`} pages={["search"]} />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* Sidebar */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-blues-200 shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
                }`}
              >
                <ArrowRightLeft />
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p>Filters:</p>
                      <button
                        className="text-blue"
                        onClick={clearAllFilters}
                        type="button"
                      >
                        Clean All
                      </button>
                    </div>
                  </div>
                  <SidebarShop resetSidebar={resetSidebar} setResetSidebar={setResetSidebar} initialMainCat={mainCategory} initialSubCat={searchParams.get("subCategory1")} />
                </div>
              </form>
            </div>

            {/* Main content */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect options={options} />
                    <p>
                      Showing{" "}
                      <span className="text-dark">
                        {products.length} of {totalProducts}
                      </span>{" "}
                      Products
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setProductStyle("grid")}
                      aria-label="button for product grid tab"
                      className={`${
                        productStyle === "grid"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <Grid />
                    </button>

                    <button
                      onClick={() => setProductStyle("list")}
                      aria-label="button for product list tab"
                      className={`${
                        productStyle === "list"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <List />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  productStyle === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"
                    : "flex flex-col gap-7.5"
                }`}
              >
                {products.map((item, key) =>
                  productStyle === "grid" ? (
                    <SingleGridItem item={item} key={key} />
                  ) : (
                    <SingleListItem item={item} key={key} />
                  )
                )}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-15">
                <div className="bg-white shadow-1 rounded-md p-2">
                  <ul className="flex items-center">
                    <li>
                      <button
                        onClick={() =>
                          currentPage > 1 && setCurrentPage(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4"
                      >
                        <ChevronLeft />
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <li key={page}>
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
                              page === currentPage
                                ? "bg-blue text-white"
                                : "hover:text-white hover:bg-blue"
                            }`}
                          >
                            {page}
                          </button>
                        </li>
                      )
                    )}

                    <li>
                      <button
                        onClick={() =>
                          currentPage < totalPages &&
                          setCurrentPage(currentPage + 1)
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] hover:text-white hover:bg-blue disabled:text-gray-4"
                      >
                        <ChevronRight />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchWithSidebar;
