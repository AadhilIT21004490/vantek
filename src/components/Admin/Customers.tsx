"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { utils, writeFile } from "xlsx"; 

const Customers = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/user");
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / customersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    // Implement delete logic here using selectedId
    console.log("Deleted user with ID:", selectedId);
    setShowModal(false);
    setSelectedId(null);
  };

  if (loading) {
    return <div className="m-4 p-6 bg-[#202020] text-white rounded-lg">Loading...</div>;
  }

  //Export To Excel Function
  const exportToExcel = () => {
    const exportData = users.map((user) => ({
      Name: user.name,
      "Joined Date": user.joinedDate || "N/A",
      Phone: user.phone || "N/A",
      Country: user.country || "N/A",
      "Total Spend": user.totalPurchase || "N/A",
      "Billing Address": user.property || "N/A",
      "Recent Order": user.status || "N/A",
    }));
  
    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Customers");
    writeFile(workbook, "Customer_List.xlsx");
  };
  

  return (
    <div className="m-4 p-6 bg-[#202020] border border-gray-600 text-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">All Customer List</h2>
        <div className="flex gap-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-[#202020] text-white border border-l-red-light-6 px-4 py-2 rounded-lg pl-10 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2 text-gray-400" size={18} />
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded flex items-center justify-center"
            onClick={exportToExcel}
          >
            <Upload size={17} className="mr-2" />
            Export to Excel
          </button>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead className="border-b">
          <tr className="bg-gray-800 text-gray-300">
            <th className="p-3">Full Name</th>
            <th className="p-3">Joined Date</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Country</th>
            <th className="p-3">Tot. Spend</th>
            <th className="p-3">Billing Address</th>
            <th className="p-3">Recent Order</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id} className="border-b border-dashed text-sm border-gray-500">
              <td className="p-3 flex items-center space-x-3">
                {/* <Image
                  src={user.avatar || "/images/users/default.jpg"}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                /> */}
                <span>{user.name}</span>
              </td>
              <td className="p-3">{user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : "N/A"}</td>
              <td className="p-3">{user.phone || "N/A"}</td>
              <td className="p-3">{user.country || "N/A"}</td>
              <td className="p-3">{user.totalPurchase || "N/A"}</td>
              <td className="p-3">{user.property || "N/A"}</td>
              <td className="p-3">{user.status || "N/A"}</td>
              <td className="p-3 flex space-x-2">
                <button
                  className="flex items-center justify-center rounded-lg w-9 h-9 bg-blue-light-4 border border-hidden ease-out duration-200 hover:bg-blue-light hover:border-white text-dark hover:text-white"
                  onClick={() =>
                    router.push(`/admin/adminUserDetails/${user._id}`)
                  }
                >
                  <Eye size={16} />
                </button>
                <button
                  className="flex items-center justify-center rounded-lg w-9 h-9 bg-red-light-4 border border-hidden ease-out duration-200 hover:bg-red-dark hover:border-white text-dark hover:text-white"
                  onClick={() => handleDeleteClick(user._id)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PopUp Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Do you really want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Customers;
