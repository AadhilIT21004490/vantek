import React from "react";
import { Metadata } from "next";
import Orders from "@/components/Admin/Orders";

export const metadata: Metadata = {
  title: "Order management Page | Vantek E-commerce",
  description: "This is Order management Page for Vantek E-commerce Site",
  // other metadata
};

const AdminOrdersPage = () => {
  return (
    <div className="bg-gray-900 w-screen h-full">
      <Orders/>
    </div>
  );
};

export default AdminOrdersPage;
