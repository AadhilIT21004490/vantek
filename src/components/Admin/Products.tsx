"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Pencil, Plus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import EditProduct from "./EditProduct";

const ProductList = () => {
  const [productData, setProductData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 25;
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const filteredProducts = productData.filter(
    (product) =>
      product?.name?.toLowerCase().includes(search?.toLowerCase()) ||
      product?.productCode?.toLowerCase().includes(search?.toLowerCase())
  );

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const exportToExcel = () => {
    const dataToExport = productData.map((product) => ({
      "Product Code": product.productCode,
      Name: product.name,
      Category: product.mainCategory,
      "Sub-Category 1": product.subCategory1,
      "Sub-Category 2": product.subCategory2,
      "Variants Count": product.variants.length,
      "Last Update": product.updatedAt?.split("T")[0],
      "Published Date": product.createdAt?.split("T")[0],
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ALL_PRODUCTS");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(dataBlob, "products.xlsx");
  };

  // ✅ fetchData is defined at component level so it can be passed as onSuccess
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/products`
      );
      const data = await res.json();

      if (res.ok) {
        setProductData(data.products);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalProducts);
      } else {
        console.error("❌ API Error:", data.message);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (
    productId: string,
    action: "toggleVisibility" | "toggleFeatured" | "toggleTopSelling"
  ) => {
    try {
      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/admin/product`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action, id: productId }),
        }
      );

      if (res.ok) {
        await fetchData();
      } else {
        const data = await res.json();
        console.error(`Failed to toggle: ${data.message}`);
      }
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showEditPopup ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showEditPopup]);

  return (
    <div className="m-4 p-6 bg-[#202020] border border-gray-600 text-sm text-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">All Products</h2>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-dark-2 text-white border-hidden border-l-red-light-6 px-4 py-2 rounded-lg pl-10 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded flex items-center justify-center"
            onClick={exportToExcel}
          >
            <Upload size={15} className="mr-2" />
            Export to Excel
          </button>

          <button
            className="bg-blue-light hover:bg-blue-dark text-white font-semibold px-4 py-2 border-hidden rounded flex items-center justify-center"
            onClick={() => router.push("/admin/add-product")}
          >
            <Plus className="mr-2" size={15} />
            Add Product
          </button>
        </div>
      </div>

      {/* Edit Product POPUP */}
      {showEditPopup && selectedProduct && (
        <div className="backdrop-blur-md bg-black/60 fixed inset-0 z-50 flex justify-center items-center overflow-auto">
          <div className="text-black rounded-lg w-[90%] max-w-fit max-h-[90vh] overflow-y-auto p-1 relative hide-scrollbar">
            <button
              className="rounded-lg mr-5 mt-5 p-2 bg-red absolute top-2 right-2 text-white hover:text-black"
              onClick={() => setShowEditPopup(false)}
            >
              ✕
            </button>
            <EditProduct
              productId={selectedProduct}
              onClose={() => setShowEditPopup(false)}
              onSuccess={fetchData} // ✅ re-fetches table after successful update
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <table className="w-full text-left border-collapse">
            <thead className="border-b">
              <tr className="bg-gray-800 text-gray-300">
                <th className="p-3 text-sm">Product Code</th>
                <th className="p-3 text-sm">Product</th>
                <th className="p-3 text-sm">Category</th>
                <th className="p-3 text-sm">Subcategory</th>
                <th className="p-3 text-sm">Subcategory 2</th>
                <th className="p-3 text-sm">Variants</th>
                <th className="p-3 text-sm">Last Update</th>
                <th className="p-3 text-sm">Published</th>
                <th className="p-3 text-sm">Visible</th>
                <th className="p-3 text-sm">Featured</th>
                <th className="p-3 text-sm">Trending</th>
                <th className="p-3 text-sm">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-dashed border-gray-5"
                >
                  <td className="p-3">{product?.productCode}</td>
                  <td className="p-3 flex items-center space-x-3">
                    <span>{product.name}</span>
                  </td>
                  <td className="p-3">{product?.mainCategory}</td>
                  <td className="p-3">{product?.subCategory1}</td>
                  <td className="p-3">{product?.subCategory2}</td>
                  <td className="p-3">{product.variants.length}</td>
                  <td className="p-3">{product?.updatedAt.split("T")[0]}</td>
                  <td className="p-3">{product?.createdAt.split("T")[0]}</td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={product?.isVisible}
                      onChange={() =>
                        handleToggle(product._id, "toggleVisibility")
                      }
                      className="cursor-pointer"
                      aria-label="Toggle Visible"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={product?.featuredProduct}
                      onChange={() =>
                        handleToggle(product._id, "toggleFeatured")
                      }
                      className="cursor-pointer"
                      aria-label="Toggle Featured"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={product?.topSellingProduct}
                      onChange={() =>
                        handleToggle(product._id, "toggleTopSelling")
                      }
                      className="cursor-pointer"
                      aria-label="Toggle Trending"
                    />
                  </td>
                  <td className="p-3 flex space-x-2">
                    <a
                      href={`/product/${product._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-lg w-9 h-9 bg-blue-light-4 border border-hidden ease-out duration-200 hover:bg-blue-light hover:border-white text-dark hover:text-white"
                    >
                      <Eye size={16} />
                    </a>
                    <button
                      className="flex items-center justify-center rounded-lg w-9 h-9 bg-green-light-4 border border-hidden ease-out duration-200 hover:bg-green-dark hover:border-white text-dark hover:text-white"
                      onClick={() => {
                        setSelectedProduct(product._id);
                        setShowEditPopup(true);
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
        </>
      )}
    </div>
  );
};

export default ProductList;