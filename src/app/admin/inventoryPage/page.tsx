import React from "react";
import { Metadata } from "next";
import ProductList from "@/components/Admin/Products";

export const metadata: Metadata = {
  title: "Inventory management Page | Vantek E-commerce",
  description: "This is Inventory management Page for Vantek E-commerce Site",
  // other metadata
};

const InventoryPage = () => {
  return (
    <div className=" bg-gray-900 w-full h-full min-h-screen">
      <ProductList/>
    </div>
  );
};

export default InventoryPage;
