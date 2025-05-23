"use client";

import { Star, ChevronDown, Plus, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

type Order = {
  id: string;
  productName: string;
  price: string;
  status: "Active" | "Inactive";
  address: string;
  startDateTime?: string;
  endDateTime?: string;
  productImage: string;
  showBuyNow?: boolean;
};

const orders: Order[] = [
  {
    id: "#SPK1203",
    productName: "Weekly 25% OFF",
    price: "25%",
    status: "Active",
    address: "Enjoy 25% savings every week on your favorite treats!",
    startDateTime: "29,Oct 2025 - 12:47PM",
    endDateTime: "31,Oct 2025 - 12:47PM",
    productImage: "/images/hero/hero-01.png",
  },
  {
    id: "#SPK1684",
    productName: "Eid Sale 15% OFF",
    price: "15%",
    status: "Inactive",
    address: "Enjoy 15% savings on your Eid ul Adha Fastival Day!",
    startDateTime: "29,Oct 2025 - 12:47PM",
    endDateTime: "31,Oct 2025 - 12:47PM",
    productImage: "/images/hero/hero-01.png",
  },
  {
    id: "#SPK2936",
    productName: "Black Friday SALE",
    price: "30%",
    status: "Inactive",
    address: "The biggest sale of the year—grab 30% OFF now!",
    startDateTime: "29,Oct 2025 - 12:47PM",
    endDateTime: "31,Oct 2025 - 12:47PM",
    productImage: "/images/hero/hero-01.png",
  },
  {
    id: "#SPK1855",
    productName: "11.11 SALE",
    price: "45%",
    status: "Active",
    address: "One-day only! Get 45% OFF on 11.11—don’t miss out!",
    startDateTime: "29,Oct 2025 - 12:47PM",
    endDateTime: "31,Oct 2025 - 12:47PM",
    productImage: "/images/hero/hero-01.png",
  },
  {
    id: "#SPK1234",
    productName: "Flate 50% OFF",
    price: "50%",
    status: "Active",
    address: "Half price on everything—grab your favorites at 50% OFF!",
    startDateTime: "29,Oct 2025 - 12:47PM",
    endDateTime: "31,Oct 2025 - 12:47PM",
    productImage: "/images/hero/hero-01.png",
    showBuyNow: true,
  },
];

const statusStyles: Record<Order["status"], string> = {
  Active: "bg-green-500 text-white px-2 py-1 rounded text-xs",
  Inactive: "bg-red-500 text-white px-2 py-1 rounded text-xs",
};

const BannerList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="p-6 rounded-lg text-white text-sm">
      <div className="bg-[#1f1f1f] p-3 rounded-md mb-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p>
            Total number of offers active up to now :{" "}
            <span className="text-green-400 font-semibold">
              {orders.length}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-800 px-3 py-2 rounded-lg outline-none w-full sm:w-60"
              />
              <button className="bg-gray-700 px-4 py-2 ml-2 rounded-lg hover:bg-gray-600 whitespace-nowrap">
                Search
              </button>
            </div>

            <button
              className="bg-blue-light hover:bg-blue-dark text-white px-4 py-2 rounded-lg flex items-center justify-center w-full sm:w-auto"
              onClick={() => setIsOpen(true)}
            >
              <Plus className="mr-1" size={16} />
              Create Promo
            </button>

            {/* PopUp Form Begins */}
            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
                <div className="bg-[#121212] text-white rounded-xl p-6 w-full max-w-xl shadow-lg relative">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>

                  <h2 className="text-xl font-semibold mb-6">Create a Promo</h2>

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Promo Title
                        </label>
                        <input
                          type="text"
                          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md px-3 py-2 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Promo Code
                        </label>
                        <input
                          type="text"
                          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md px-3 py-2 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Promo Description
                      </label>
                      <textarea
                        rows={4}
                        className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md px-3 py-2 focus:outline-none"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          OFF Percentage
                        </label>
                        <input
                          type="email"
                          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md px-3 py-2 focus:outline-none"
                        />
                      </div>

                      {/* Image Input */}
                      <div>
                        <label className="block text-sm mb-1">
                          Upload Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setImage(e.target.files?.[0] || null)
                          }
                          className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-3 py-2 text-sm file:text-white file:bg-blue-600 file:border-none file:px-4 file:py-1 file:rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={accepted}
                        onChange={() => setAccepted(!accepted)}
                        className="mt-1"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-300">
                        By submitting this form I'm creating a new Promo
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!accepted}
                      className={`w-full py-2 rounded-md font-medium transition ${
                        accepted
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      CREATE
                    </button>

                    <p className="text-center text-sm text-gray-400 mt-2">
                      Great! Promo is active now.
                    </p>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-[#202020] p-4 rounded-lg space-y-3 border border-gray-800"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex flex-col  bg-gray-800 rounded-lg text-white text-xs">
                  <Image
                    src={order.productImage}
                    alt="Promo Image"
                    width={40}
                    height={40}
                  />
                </div>

                <div className="ml-1">
                  <p className="font-semibold">{order.productName}</p>
                  <p className="text-green-400">
                    OFF Percentage : {order.price}
                  </p>
                </div>
              </div>
              <div className="text-right justify-end text-gray-400 text-xs">
                <p className="text-white">Promo Code :</p>
                <p>{order.id}</p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <p className="text-gray-400">Promo Description :</p>
              <p>{order.address}</p>
            </div>

            {order.status === "Active" && order.startDateTime && (
              <div className="flex justify-between items-center text-xs text-gray-300">
                <span>Start on : {order.startDateTime}</span>
                <span>End on : {order.endDateTime}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <p className="text-sm">
                Status :{" "}
                <span className={statusStyles[order.status]}>
                  {order.status}
                </span>
              </p>
              <div className="felx items-center">
                <button className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-xs">
                  Delete
                </button>
                <button className="bg-blue-600 text-white ml-3 px-3 py-2 rounded hover:bg-blue-700 text-xs">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerList;
