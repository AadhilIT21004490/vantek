"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  ShoppingCart,
  MessageSquare,
  Inbox,
  FileText,
  Layers,
  Package,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/features/authSlice";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const dispatch = useDispatch();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", icon: Layers, link: "/admin" },
    { name: "Orders", icon: ShoppingCart, link: "/admin/adminOrders" },
    { name: "Customers", icon: Users, link: "/admin/adminCustomers" },
    { name: "Transactions", icon: FileText, link: "/adminTransactions" },
    { name: "Inventory", icon: Package, link: "/admin/inventoryPage" },
    { name: "Banner", icon: MessageSquare, link: "/admin/adminBanners" },
    { name: "Logout", icon: LogOut, link: "", onClick: () => handleLogout() },
  ];

  const handleLogout = async () => {
    const res = await fetch("http://localhost:3000/api/logout");
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      dispatch(logout());
      router.replace("/");
    }
    // TODO: implement Toaster to show errors ....
    console.log("Logout failed");
  };

  return (
    <aside className="w-64 min-h-screen bg-dark-2 backdrop-blur-lg text-white p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="bg-pink-500 p-2 rounded-full">
          <Home className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold">VANTEK</span>
      </div>

      {/* Menu */}
      <nav className="flex-1">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.name === "Logout" ? (
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-reds-600 hover:text-white text-left ${
                    active === item.name ? "bg-gray-800" : ""
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </button>
              ) : (
                <Link
                  href={item.link}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-meta-4 ${
                    active === item.name ? "bg-gray-800" : ""
                  }`}
                  onClick={() => setActive(item.name)}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
