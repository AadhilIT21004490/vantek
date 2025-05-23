import { Printer, Share } from "lucide-react";
import Image from "next/image";
import React from "react";

const OrderDetails = ({ orderItem }: any) => {
  const orderDetails = {
    orderNo: "VTK-1023",
    estimatedDelivery: "30, Nov 2025",
    items: [
      {
        id: 1,
        name: "Sorento Turbo",
        size: "44mm",
        color: "Metallic Black",
        trackingNo: "SPK1218153635",
        price: "$1,249",
        quantity: 1,
        totalPrice: "$1,249",
        image: "/images/products/product-gen-bg-1.png",
      },
      {
        id: 2,
        name: "KIA Sorento break lights",
        size: "Unique",
        color: "Red",
        trackingNo: "SPK3789423789",
        price: "$499",
        quantity: 2,
        totalPrice: "$998",
        image: "/images/products/product-gen-bg-1.png",
        badge: "In Offer",
      },
      {
        id: 4,
        name: "KIA Sorento break lights",
        size: "Unique",
        color: "Red",
        trackingNo: "SPK3789423789",
        price: "$499",
        quantity: 2,
        totalPrice: "$998",
        image: "/images/products/product-gen-bg-1.png",
        badge: "In Offer",
      },
      {
        id: 3,
        name: "KIA Sorento head Lamp",
        size: "Regular",
        color: "Xenon",
        trackingNo: "SPK1120324532",
        price: "$799",
        quantity: 1,
        totalPrice: "$799",
        image: "/images/products/product-gen-bg-1.png",
        badge: "",
      },
    ],
    subTotal: "$3,100",
    totalItems: 4,
    appliedCoupon: "SPKFIR",
    deliveryFees: "+$29",
    totalSaved: "$3,799",
    totalPrice: "$3,129",
  };

  return (
    <>
      <div className="bg-dark text-white p-6 rounded-lg">
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h2 className="border-l-4 border-l-blue-600 pl-2 text-lg font-bold">
            Order No -{" "}
            <span className="text-green-light-3">#{orderDetails.orderNo}</span>
          </h2>
          <span className="text-sm bg-purple-300 text-green-900 px-3 py-1 rounded">
            Estimated delivery : {orderDetails.estimatedDelivery}
          </span>
        </div>

        <div
          className={`mt-4 overflow-y-auto ${
            orderDetails.items.length > 3 ? "max-h-[300px]" : ""
          }`}
        >
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="p-3">Items</th>
                <th className="p-3">Tracking No</th>
                <th className="p-3">Price</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-700">
                  <td className="p-3 flex items-center space-x-3">
                    <div className="bg-meta-3 rounded-md">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-400">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      {item.badge && (
                        <span className="text-xs bg-blue-500 px-2 py-1 rounded text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-purple-400">{item.trackingNo}</td>
                  <td className="p-3 font-bold">{item.price}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3 font-bold">{item.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 border-t border-gray-6 pt-4">
          <div className="flex justify-between mb-2">
            <span>Total Items:</span>
            <span>{orderDetails.totalItems}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Sub Total:</span>
            <span>{orderDetails.subTotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Applied Coupon:</span>
            <span className="bg-green-500 px-2 py-1 rounded text-white">
              {orderDetails.appliedCoupon}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery Fees:</span>
            <span className="text-red-400">{orderDetails.deliveryFees}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total Saved:</span>
            <span className="text-green-400">{orderDetails.totalSaved}</span>
          </div>
          <div className="flex justify-between text-xl font-bold mt-3">
            <span>Total Price:</span>
            <span>{orderDetails.totalPrice}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button className="flex items-center bg-teal-700 hover:bg-teal-900 text-white px-4 py-2 rounded">
            <Printer size={16} className="mr-2" /> Print
          </button>
          <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            <Share size={16} className="mr-2" /> Share Details
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
