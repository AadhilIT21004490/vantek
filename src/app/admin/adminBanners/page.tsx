import React from "react";
import { Metadata } from "next";
import BannerList from "@/components/Admin/banners";

export const metadata: Metadata = {
  title: "Banner management Page | Vantek E-commerce",
  description: "This is Banner management Page for Vantek E-commerce Site",
  // other metadata
};

const AdminBannersPage = () => {
  return (
    <div className="bg-gray-900 w-screen h-full min-h-screen">
      <div>
        <BannerList/>
      </div>
    </div>
  );
};

export default AdminBannersPage;