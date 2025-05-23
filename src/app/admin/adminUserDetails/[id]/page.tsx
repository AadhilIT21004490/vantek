import React from "react";
import { Metadata } from "next";
import UserDetails from "@/components/Admin/UserDetails";
import UserOrders from "@/components/Admin/UserOrders";

export const metadata: Metadata = {
  title: "User detail Page | Vantek E-commerce",
  description: "This is User Detail Page for Vantek E-commerce Site",
  // other metadata
};

const AdminUserDetailsPage = () => {
  return (
    <div className="bg-gray-900 w-screen h-full grid grid-cols-6 grid-rows-1">
      <div className="col-span-2 row-span-1"><UserDetails/></div>
      <div className="col-span-4 row-span-1 col-start-3"><UserOrders/></div>
      
    </div>
  );
};

export default AdminUserDetailsPage;
