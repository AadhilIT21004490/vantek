"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Pencil, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ordersData = [
  {
    id: 1,
    name: "Michael A. Miner",
    date: "01/26/2025",
    contact: "+231 06-75820711",
    orderID: "VTK-68547512",
    amount: "$45,842",
    property: "4604 , Philli Lane Kiowa",
    status: "Pending",
    statusColor: "bg-green-500",
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: "Michael A. Miner",
    date: "01/26/2025",
    contact: "+231 06-75820711",
    orderID: "VTK-68547512",
    amount: "$45,842",
    property: "4604 , Philli Lane Kiowa",
    status: "Pending",
    statusColor: "bg-green-500",
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: "Kabeeb",
    date: "01/26/2025",
    contact: "+231 06-75820711",
    orderID: "VTK-68547512",
    amount: "$45,842",
    property: "4604 , Philli Lane Kiowa",
    status: "Cancelled",
    statusColor: "bg-green-500",
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: "Rafeek",
    date: "01/26/2025",
    contact: "+231 06-75820711",
    orderID: "VTK-68547512",
    amount: "$45,842",
    property: "4604 , Philli Lane Kiowa",
    status: "Cancelled",
    statusColor: "bg-green-500",
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: "Michael A. Miner",
    date: "01/26/2025",
    contact: "+231 06-75820711",
    orderID: "VTK-68547512",
    amount: "$45,842",
    property: "4604 , Philli Lane Kiowa",
    status: "Delivered",
    statusColor: "bg-green-500",
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: "Michael A. Miner",
    date: "01/26/2025",
    contact: "+231 06-75820711",
    orderID: "VTK-68547512",
    amount: "$45,842",
    property: "4604 , Philli Lane Kiowa",
    status: "Cancelled",
    statusColor: "bg-green-500",
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: "Kabeeb",
    date: "01/26/2025",
    contact: "+231 06-75820711",
    orderID: "VTK-68547512",
    amount: "$45,842",
    property: "4604 , Philli Lane Kiowa",
    status: "Delivered",
    statusColor: "bg-green-500",
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: "Rafeek",
    date: "01/26/2025",
    contact: "+231 06-75820711",
    orderID: "VTK-68547512",
    amount: "$45,842",
    property: "4604 , Philli Lane Kiowa",
    status: "Pending",
    statusColor: "bg-green-500",
    avatar: "/images/users/cus1.jpg",
  },
];

const Orders = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCurrentPage(1);
  }, [search, fromDate, toDate]);

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch = order.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const orderDate = new Date(order.date);
    const isAfterFromDate = fromDate ? orderDate >= new Date(fromDate) : true;
    const isBeforeToDate = toDate ? orderDate <= new Date(toDate) : true;
    return matchesSearch && isAfterFromDate && isBeforeToDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="m-4 p-6 bg-[#202020] border border-gray-600 text-sm text-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">All Order List</h2>
        <div className="flex">
          <div className="flex items-center gap-4 mx-4">
            <div className="flex items-center">
              <Search
                className="absolute ml-4 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search orders..."
                className="bg-gray-800 text-white border border-gray-600 px-4 py-2 rounded-lg pl-10 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="text-sm font-medium text-gray-300 mb-1">
                From Date :
              </label>
              <input
                type="date"
                className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="text-sm font-medium text-gray-300 mb-1">
                To Date :
              </label>
              <input
                type="date"
                className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div>
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded flex items-center justify-center">
                <Upload size={17} className="mr-2" />
                Export to Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead className="border-b">
          <tr className="bg-gray-800 text-gray-300 text-base">
            <th className="p-3">Customer</th>
            <th className="p-3">Purchase Date</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Order ID</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Billing Address</th>
            <th className="p-3">Order Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.id} className="border-b border-gray-700">
              <td className="p-3 flex items-center space-x-3">
                <Image
                  src={order.avatar}
                  alt={order.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span>{order.name}</span>
              </td>
              <td className="p-3">{order.date}</td>
              <td className="p-3">{order.contact}</td>
              <td className="p-3">{order.orderID}</td>
              <td className="p-3">{order.amount}</td>
              <td className="p-3">{order.property}</td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    order.status === "Delivered"
                      ? "text-green-light-2"
                      : order.status === "Cancelled"
                      ? "text-red-light"
                      : order.status === "Pending"
                      ? "text-yellow-light"
                      : ""
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="p-3 flex space-x-2">
                <button
                  className="flex items-center justify-center rounded-lg w-9 h-9 bg-blue-light-4 border border-hidden ease-out duration-200 hover:bg-blue-light hover:border-white text-dark hover:text-white"
                  onClick={() => router.push("/admin/adminOrderDetails")}
                >
                  <Eye size={16} />
                </button>
                <button className="flex items-center justify-center rounded-lg w-9 h-9 bg-green-light-4 border border-hidden ease-out duration-200 hover:bg-green-dark hover:border-white text-dark hover:text-white">
                  <Pencil size={16} />
                </button>
                <button className="flex items-center justify-center rounded-lg w-9 h-9 bg-red-light-4 border border-hidden ease-out duration-200 hover:bg-red-dark hover:border-white text-dark hover:text-white">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-800 rounded-lg">
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
