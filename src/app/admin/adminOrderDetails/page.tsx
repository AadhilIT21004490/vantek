import React from "react";
import { Metadata } from "next";
import AdminOrderDetails from "@/components/Admin/AdminOrderDetails";

export const metadata: Metadata = {
  title: "Order management Page | Vantek E-commerce",
  description: "This is Order management Page for Vantek E-commerce Site",
  // other metadata
};

const AdminOrdersDetailsPage = () => {
  return (
    <div className="bg-gray-900 w-screen h-full ">
      <AdminOrderDetails/>
    </div>
  );
};

export default AdminOrdersDetailsPage;
