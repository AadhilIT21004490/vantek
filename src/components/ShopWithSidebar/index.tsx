/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import {
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
} from "lucide-react";
import SidebarShop from "./SidebarShop";
import PreLoader from "../Common/PreLoader";
import { parseCategoriesFromApiUrl } from "@/helper/parseCategoryFromApiUrl";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { clearApiUrl } from "@/redux/features/shopFilter-slice";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const ShopWithSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [resetSidebar, setResetSidebar] = useState(false);
  //Fetching all Products
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Extract URL Parameters
  const mainCategory = searchParams.get("mainCategory");
  const subCategory1 = searchParams.get("subCategory1");
  const subCategory2Param = searchParams.get("subCategory2");
  const searchQueryParam = searchParams.get("search");

  useEffect(() => {
    // We don't need selected state anymore conceptually, but SidebarShop uses it for visual mapping.
    // It will be managed actively in SidebarShop itself based on URL now.
    setResetSidebar(false);
  }, [searchParams]);

  const clearAllFilters = () => {
    setCurrentPage(1);
    const newParams = new URLSearchParams();
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  // LocalStorage
  const CACHE_EXPIRY_MS = 1000 * 60 * 30;

  const buildCacheKey = (page: number, filters: Record<string, string[]>, url: string) => {
    const filterKey = url || JSON.stringify(filters);
    return `products_cache_page_${page}_filters_${filterKey}`;
  };

  const fetchData = useCallback(async (page = 1) => {
    if (page < 1) page = 1;
    setLoading(true);

    const BASE =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASEURL
        : process.env.NEXT_PUBLIC_BASEURL_LOCAL;

    const queryParams = new URLSearchParams();
    queryParams.set("page", String(page));
    queryParams.set("isVisible", "true");

    if (mainCategory) queryParams.set("mainCategory", mainCategory);
    if (subCategory1) queryParams.set("subCategory1", subCategory1);
    if (subCategory2Param) queryParams.set("subCategory2", subCategory2Param);
    if (searchQueryParam) queryParams.set("search", searchQueryParam);

    const fetchUrl = `${BASE}/products?${queryParams.toString()}`;

    const cacheKey = buildCacheKey(page, {}, queryParams.toString());

    // Try reading from localStorage cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
          setProducts(data.products);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
          setTotalProducts(data.totalProducts);
          setLoading(false);
          return;
        }
      } catch {
        console.warn("Invalid cache, fetching fresh data");
      }
    }

    // No valid cache — fetch from API
    try {
      const res = await fetch(fetchUrl);
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products || []);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data })
        );
      } else {
        console.error("❌ API Error:", data.message);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainCategory, subCategory1, subCategory2Param, searchQueryParam]);

  // Single unified effect — triggers on URL params or page change
  useEffect(() => {
    fetchData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, currentPage]);

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  const options = [
    { label: "Latest Products", value: "0" },
    { label: "Best Selling", value: "1" },
    { label: "Old Products", value: "2" },
  ];

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

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
  });

  // Used to sync sidebar open state with navbar category selection
  const navbarMainCat = mainCategory;
  const navbarSubCat = subCategory1;

  return (
    <>
      <div className="hidden">
        {/* We can temporarily keep these unused imports suppressed or removed */}
      </div>
      {loading && <PreLoader />}
      <Breadcrumb
        title={
          subCategory1 && mainCategory
            ? `Result for ${subCategory1} in ${mainCategory}`
            : "Explore All Products"
        }
        pages={["shop"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* <!-- Sidebar Start --> */}
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
                className={`xl:hidden absolute -bottom-10 -right-94 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-blues-200 shadow-1`}
              >
                <ArrowRightLeft />
              </button>

              {/* <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-blues-200 shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
                }`}
              >
                <ArrowRightLeft />
              </button> */}

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* <!-- filter box --> */}
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p>Filters:</p>
                      <button onClick={clearAllFilters} className="text-blue">
                        Clean All
                      </button>
                    </div>
                  </div>
                  <SidebarShop
                resetSidebar={resetSidebar}
                setResetSidebar={setResetSidebar}
                initialMainCat={navbarMainCat}
                initialSubCat={navbarSubCat}
              />
                </div>
              </form>
            </div>
            {/* // <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  {/* <!-- top bar left --> */}
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

                  {/* <!-- top bar right --> */}
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

              {/* <!-- Products Grid Tab Content Start --> */}
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
              {/* <!-- Products Grid Tab Content End --> */}

              {/* <!-- Products Pagination Start --> */}
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

              {/* <!-- Products Pagination End --> */}
            </div>
            {/* // <!-- Content End --> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
