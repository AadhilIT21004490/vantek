"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomSelect from "./CustomSelect";
import { menuData } from "./menuData";
import Dropdown from "./Dropdown";
import { RootState, useAppSelector } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import Image from "next/image";
import { Heart, Lock, Phone, Search, ShoppingCart, User } from "lucide-react";
import { generateAvatarUrl } from "@/helper/generateAvatarUrl";
import { formatToEuro } from "@/helper/formatCurrencyToEuro";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const { openCartModal } = useCartModalContext();

  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  const handleOpenCartModal = () => {
    openCartModal();
  };

  const handleSearch = () => {
    const query = searchQuery.trim();
    const category = selectedCategory;
    const limit = 10; // or get from state
    const page = 1; // reset to first page on new search

    const params = new URLSearchParams();

    if (query) params.append("search", query);
    if (category && category !== "All Categories") {
      params.append("mainCategory", category);
    }
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    router.push(`/search?${params.toString()}`);
  };

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  const handleAccountClick = () => {
    // Navigate to the appropriate page based on user authentication status
    if (user) {
      router.push("/my-account"); // If user is authenticated, go to "my-account" page
    } else {
      router.push("/signin"); // If not, go to "signin" page
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
  });

  const options = [
    { label: "All Categories", value: "0" },
    { label: "VW-T6", value: "1" },
    { label: "VW-T6.1", value: "2" },
    { label: "VW-T7", value: "3" },
    { label: "Universal Camper Parts", value: "4" },
  ];

  return (
    <header
      className={`fixed left-0 top-0 w-full z-9999 bg-white transition-all ease-in-out duration-300 ${
        stickyMenu && "shadow"
      }`}
    >
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        {/* <!-- header top start --> */}
        <div
          className={`flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between ease-out duration-200 ${
            stickyMenu ? "py-4" : "py-6"
          }`}
        >
          {/* <!-- header top left --> */}
          <div className="xl:w-auto flex-col sm:flex-row w-full flex sm:justify-between sm:items-center gap-5 sm:gap-10">
            <Link className="flex-shrink-0" href="/">
              <Image
                src="/images/logo/vt_lg.png"
                alt="Logo"
                width={219}
                height={36}
                style={{ width: "80px", height: "auto" }}
              />
            </Link>

            <div className="max-w-[475px] w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent page reload
                  handleSearch();
                }}
              >
                <div className="flex items-center">
                  <CustomSelect
                    options={options}
                    onChange={(value) => setSelectedCategory(value)}
                  />

                  <div className="relative w-full max-w-[333px] sm:min-w-[333px] flex items-center">
                    {/* Vertical Divider */}
                    <span className="absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 bg-gray-300"></span>

                    {/* Search Input */}
                    <input
                      type="search"
                      name="search"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="I am shopping for..."
                      autoComplete="off"
                      className="w-full rounded-md bg-gray-100 border border-gray-300 pl-4 pr-10 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />

                    {/* Search Button */}
                    <button
                      type="submit"
                      aria-label="Search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                    >
                      <Search size={18} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* <!-- header top right --> */}
          <div className="flex w-full lg:w-auto items-center gap-7.5">
            <div className="hidden xl:flex items-center gap-3.5">
              <Phone />

              <div>
                <span className="block text-2xs text-dark-4 uppercase">
                  24/7 SUPPORT
                </span>
                <a href="tel:01933422555">
                  <p className="font-medium text-custom-sm text-dark">
                    01933-422-555
                  </p>
                </a>
              </div>
            </div>

            {/* <!-- divider --> */}
            <span className="hidden xl:block w-px h-7.5 bg-gray-4"></span>

            <div className="flex w-full lg:w-auto justify-between items-center gap-5">
              <div className="flex items-center gap-5">
                <button
                  onClick={handleAccountClick}
                  className="flex items-center gap-2.5"
                >
                  {user ? (
                    <Image
                      src={generateAvatarUrl(user?.email, 32)}
                      alt="user"
                      height={32}
                      width={32}
                    />
                  ) : (
                    <User />
                  )}

                  <div>
                    <span className="block text-2xs text-dark-4 uppercase">
                      account
                    </span>
                    <p className="font-medium text-custom-sm text-dark truncate max-w-[100px]">
                      {user ? user.name : "Sign in"}
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleOpenCartModal}
                  className="flex items-center gap-2.5"
                >
                  <span className="inline-block relative">
                    <ShoppingCart className=" text-blue rounded" />

                    <span className="flex items-center justify-center font-medium text-2xs absolute -right-2 -top-2.5 bg-blue w-4.5 h-4.5 rounded-full text-white">
                      {product.length}
                    </span>
                  </span>

                  <div>
                    <span className="block text-2xs text-dark-4 uppercase">
                      cart
                    </span>
                    <p className="font-medium text-custom-sm text-dark">
                      {formatToEuro(totalPrice)}
                    </p>
                  </div>
                </button>

                <div className="xl:hidden items-center gap-3.5">
                  <div>
                    <span className="block text-2xs text-dark-4 uppercase">
                      24/7 SUPPORT
                    </span>
                    <a href="tel:01933422555">
                      <p className="font-medium text-custom-sm text-dark">
                        01933-422-555
                      </p>
                    </a>
                  </div>
                </div>
              </div>

              {/* <!-- Hamburger Toggle BTN --> */}
              <button
                id="Toggle"
                aria-label="Toggler"
                className="xl:hidden block"
                onClick={() => setNavigationOpen(!navigationOpen)}
              >
                <span className="block relative cursor-pointer w-5.5 h-5.5">
                  <span className="du-block absolute right-0 w-full h-full">
                    <span
                      className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-[0] ${
                        !navigationOpen && "!w-full delay-300"
                      }`}
                    ></span>
                    <span
                      className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-150 ${
                        !navigationOpen && "!w-full delay-400"
                      }`}
                    ></span>
                    <span
                      className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-200 ${
                        !navigationOpen && "!w-full delay-500"
                      }`}
                    ></span>
                  </span>

                  <span className="block absolute right-0 w-full h-full rotate-45">
                    <span
                      className={`block bg-dark rounded-sm ease-in-out duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-full ${
                        !navigationOpen && "!h-0 delay-[0] "
                      }`}
                    ></span>
                    <span
                      className={`block bg-dark rounded-sm ease-in-out duration-200 delay-400 absolute left-0 top-2.5 w-full h-0.5 ${
                        !navigationOpen && "!h-0 dealy-200"
                      }`}
                    ></span>
                  </span>
                </span>
              </button>
              {/* //   <!-- Hamburger Toggle BTN --> */}
            </div>
          </div>
        </div>
        {/* <!-- header top end --> */}
      </div>

      <div className="border-t border-gray-3">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
          <div className="flex items-center justify-between">
            {/* <!--=== Main Nav Start ===--> */}
            <div
              className={`w-[288px] absolute right-4 top-full xl:static xl:w-auto h-0 xl:h-auto invisible xl:visible xl:flex items-center justify-between ${
                navigationOpen &&
                `!visible bg-white shadow-lg border border-gray-3 !h-auto max-h-[400px] overflow-y-scroll rounded-md p-5`
              }`}
            >
              {/* <!-- Main Nav Start --> */}
              <nav>
                <ul className="flex xl:items-center flex-col xl:flex-row gap-5 xl:gap-6">
                  {menuData.map((menuItem, i) =>
                    menuItem.submenu ? (
                      <Dropdown
                        key={i}
                        menuItem={menuItem}
                        stickyMenu={stickyMenu}
                      />
                    ) : (
                      <li
                        key={i}
                        className="group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full "
                      >
                        <Link href={menuItem.path}>
                          <span
                            onClick={() => {
                              setNavigationOpen(false); // <-- closes mobile menu
                            }}
                            className={`hover:text-blue text-custom-sm font-medium text-dark flex ${
                              stickyMenu ? "xl:py-4" : "xl:py-6"
                            }`}
                          >
                            {menuItem.title}
                          </span>
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </nav>
              {/* //   <!-- Main Nav End --> */}
            </div>
            {/* // <!--=== Main Nav End ===--> */}

            {/* // <!--=== Nav Right Start ===--> */}
            <div className="hidden xl:block">
              <ul className="flex items-center gap-5.5">
                {user?.role === "admin" && (
                  <Link href="/admin" target="_blank" className="">
                    <li className="flex items-center gap-1.5 font-medium text-custom-sm p-2 rounded-lg bg-cyan-800 text-white hover:bg-blue">
                      <Lock size={16} />
                      Admin Dashboard
                    </li>
                  </Link>
                )}

                <li className="py-4">
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-1.5 font-medium text-custom-sm text-dark hover:text-blue"
                  >
                    <Heart />
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>
            {/* <!--=== Nav Right End ===--> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
