// import AdminDashboard from "@/components/Admin/AdminDashboard";
import Dashboard from "@/components/Admin/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Vantek E-commerce",
  description: "Admin dashboard for managing Vantek E-commerce site",
  // other metadata
};

export default function AdminHomePage() {
  return (
    <>
      <Dashboard/>
    </>
  );
}
