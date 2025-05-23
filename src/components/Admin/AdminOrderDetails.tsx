"use client";

import {
  Printer,
  Share,
  ShoppingCart,
  CheckCircle,
  Truck,
  Package,
  Pencil,
  BadgeCheck,
} from "lucide-react";
import Image from "next/image";
const userData = [
  {
    avatar: "/images/users/cus1.jpg",
    name: "Aadhil Shihabdeen",
    email: "aadhilshelby@gmail.com",
    landmark: "166/16",
    street: "Groove Street",
    city: "Ontario",
    state: "New York",
    country: "USA",
    zipCode: "002584",
    phone: "+94752203374",
    lastOrderDate: "24/11/2024",
    lastOrderTime: "11.25AM",
    lastOrderAmount: "158.58",
    lastPaymentMethod: "VISA",
    totalPurchase: "285",
  },
];

const trackingSteps = [
  {
    status: "Order Placed",
    date: "Nov 03, 2022",
    icon: <ShoppingCart size={20} className="text-blue-400" />,
  },
  {
    status: "Picked",
    date: "Nov 03, 15:10",
    icon: <CheckCircle size={20} className="text-green-500" />,
  },
  {
    status: "Shipping",
    date: "Nov 03, 15:10",
    icon: <Truck size={20} className="text-red-500" />,
  },
  {
    status: "Out For Delivery",
    date: "Nov 03, 15:10 (expected)",
    icon: <Package size={20} className="text-purple-500" />,
  },
  {
    status: "Delivered",
    date: "Nov 03, 18:42",
    icon: <Package size={20} className="text-purple-500" />,
  },
];
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

const AdminOrderDetails = () => {
  const user = userData[0];
  return (
    <div className="grid grid-cols-6 grid-rows-5 gap-2">
      <div className="col-span-4 row-span-5 p-4">
        <div className="bg-dark text-white p-6 rounded-lg">
          <div className="flex justify-between items-center border-b border-gray-700 pb-3">
            <h2 className="border-l-4 border-l-blue-600 pl-2 text-lg font-bold">
              Order No -{" "}
              <span className="text-green-light-3">
                #{orderDetails.orderNo}
              </span>
            </h2>
            <span className="text-sm bg-purple-300 text-green-900 px-3 py-1 rounded">
              Estimated delivery : {orderDetails.estimatedDelivery}
            </span>
          </div>

          <table className="w-full mt-4 border-collapse text-left">
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
      </div>

      <div className="col-span-2 row-span-1 col-start-5 p-4">
        <div className="bg-dark text-white text-sm p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="border-l-4 border-l-purple-light-2 pl-2 text-lg font-semibold pb-2 mb-4">
            Order Tracking{" "}
            <span className="text-green-light-3">#SPK1218153635</span>
          </h2>
          <hr className="pt-2 pb-2" />
          <div className="space-y-4">
            {trackingSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div>{step.icon}</div>
                <div>
                  <p className="font-medium">{step.status}</p>
                  <p className="text-gray-400 text-sm">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-2 row-span-5 col-start-5 p-4">
        <div className="bg-dark text-white p-5 rounded-lg text-sm shadow-md max-w-md">
          <h2 className="text-lg font-semibold border-hidden border-gray-700 pb-2 mb-4 flex items-center">
            <span className="border-l-4 border-purple-light-2 pl-2">
              User Details
            </span>
          </h2>
          <hr className="mb-4" />

          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-12 h-12 rounded-full border-hidden border-gray-700"
            />
            <div>
              <h3 className="text-md font-bold">{user.name}</h3>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
            <BadgeCheck className="text-yellow ml-14" />
            <span className="text-xs bg-yellow-dark text-dark px-2 py-1 font-semibold rounded-lg">
              PRIME
            </span>
          </div>

          <div className="mt-4 border-t border-dashed border-gray-700 pt-4 relative">
            <h4 className="font-semibold mb-2">Delivery address :</h4>
            <button className="absolute top-4 right-4 bg-gray-700 p-1 rounded-md hover:bg-gray-600">
              <Pencil className="w-4 h-4 text-gray-300" />
            </button>
            <p>
              Landmark : <span className="opacity-75">{user.landmark}</span>
            </p>
            <p>
              Street : <span className="opacity-75">{user.street}</span>
            </p>
            <p>
              City : <span className="opacity-75">{user.city}</span>
            </p>
            <p>
              State : <span className="opacity-75">{user.state}</span>
            </p>
            <p>
              Country : <span className="opacity-75">{user.country}</span>
            </p>
            <p>
              Zipcode : <span className="opacity-75">{user.zipCode}</span>
            </p>
          </div>

          <div className="mt-4 border-t border-dashed border-gray-700 pt-4">
            <h4 className="font-semibold mb-2">Send updates to :</h4>
            <p>
              Phone : <span className="opacity-75">{user.phone}</span>
            </p>
            <p>
              Email : <span className="opacity-75">{user.email}</span>
            </p>
          </div>

          <div className="mt-4 border-t border-dashed border-gray-700 pt-4">
            <h4 className="font-semibold mb-2">Latest Order Summary</h4>
            <p>
              Ordered Date :{" "}
              <span className="opacity-75">{user.lastOrderDate}</span>
            </p>
            <p>
              Ordered Time :{" "}
              <span className="opacity-75">{user.lastOrderTime}</span>
            </p>
            <p>
              Payment Interface :{" "}
              <span className="opacity-75">{user.lastPaymentMethod}</span>
            </p>
          </div>

          <div className="mt-4 border-t border-gray-700 pt-4 text-center">
            <p>
              Total{" "}
              <span className="text-green font-semibold">
                {user.totalPurchase} items
              </span>{" "}
              purchased upto now
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
