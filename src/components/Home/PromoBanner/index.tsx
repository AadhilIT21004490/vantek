import React from "react";
import Image from "next/image";
import Link from "next/link";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- promo banner big --> */}
        <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
          <div className="max-w-[550px] w-full">
            <span className="block font-medium text-xl text-dark mb-3">
              Transit Custom 1st Gen
            </span>

            <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
              UP TO 30% OFF
            </h2>

            <p className="w-3/4 shadow-lg p-4 rounded-lg bg-white text-gray-800">
              Transit Custom 1st Gen’s Spare part are going upto 30% OFF for upcoming Weekend, Why are you waiting for !! Grab it and make your Van Unique.
            </p>


            <Link
              href="/shop"
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
            >
              Buy Now
            </Link>
          </div>

          <Image
            src="/images/promo/promo-van1.png"
            alt="promo img"
            className="absolute bottom-0 right-0 -z-1 scale-150 hidden sm:block"
            width={320}
            height={350}
            style={{ width: "320px", height: "auto" }}
          />
        </div>

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {/* <!-- promo banner small --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#DBF4F3] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <Image
              src="/images/promo/promo-van22.png"
              alt="promo img"
              className="absolute top-1/2 -translate-y-1/2 left-0 -z-1 scale-105 hidden sm:block"
              width={241}
              height={241}
              style={{ width: "241px", height: "auto" }}
            />

            <div className="text-right">
              <span className="block text-lg text-dark mb-1.5">VW-T6</span>

              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                Premium Spares
              </h2>

              <p className="font-semibold text-custom-1 text-teal">
                Flat 20% off
              </p>
              <Link
                href="/shop"
                className="inline-flex font-medium text-custom-sm text-white bg-teal py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark mt-9"
              >
                Grab Now
              </Link>
            </div>
          </div>

          {/* <!-- promo banner small --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#FFECE1] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <Image
              src="/images/promo/promo-t72.png"
              alt="promo img"
              className="absolute top-1/2 -translate-y-1/2 right-0 -z-1 scale-100 hidden sm:block"
              width={300}
              height={200}
            />

            <div>
              <span className="block text-lg text-dark mb-1.5">
                VW-T7 Camper Gadgets
              </span>

              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                Up to <span className="text-orange">40%</span> off
              </h2>

              <p className="max-w-[285px] text-custom-sm">
                Up to 40% to VW-T7 Camping Gadgets for this summer season
              </p>
              <Link
                href="/shop"
                className="inline-flex font-medium text-custom-sm text-white bg-orange py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark mt-7.5"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
