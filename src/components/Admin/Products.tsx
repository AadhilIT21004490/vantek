'use client';

import { useState } from 'react';
import { Search, Eye, Pencil, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';

const productData = [
    {
        Image : '/images/products/product-gen-bg-1.png',
        id : 56,
        product: "Fridge Freezer Alpicool TWW35 35L",
        category: "VW-T5",
        subCategory: "Alloy Wheels",
        subCategory2: "High End",
        price: 1500,
        stock: 25,
        brand: "BMW",
        published: '12/05/2024',
    },
    {
        Image : '/images/products/product-gen-bg-1.png',
        id : 3544,
        product: "Fridge Freezer Alpicool TWW35 35L",
        category: "VW-T5",
        subCategory: "Alloy Wheels",
        subCategory2: "High End",
        price: 1500,
        stock: 25,
        brand: "BMW",
        published: '12/05/2024',
    },
    {
        Image : '/images/products/product-gen-bg-1.png',
        id : 66,
        product: "Fridge Freezer Alpicool TWW35 35L",
        category: "VW-T5",
        subCategory: "Alloy Wheels",
        subCategory2: "High End",
        price: 1500,
        stock: 25,
        brand: "BMW",
        published: '12/05/2024',
    },
    {
        Image : '/images/products/product-gen-bg-1.png',
        id : 23,
        product: "Fridge Freezer Alpicool TWW35 35L",
        category: "VW-T5",
        subCategory: "Alloy Wheels",
        subCategory2: "High End",
        price: 1500,
        stock: 25,
        brand: "BMW",
        published: '12/05/2024',
    },
];

const ProductList = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);


  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

  const filteredProducts = productData.filter(product =>
    product.product.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

   // Handle individual selection
   const handleSelectProduct = (id: number) => {
    setSelectedProducts(prev =>
        prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
   };

    // Handle "Select All" toggle
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(currentProducts.map(product => product.id));
        }
        setSelectAll(!selectAll);
    };

  return (
    <div className="m-4 p-6 bg-dark text-white rounded-lg">
      {showAddProduct && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="h-screen w-screen m-1 bg-dark-2 p-6 rounded-lg">
            <AddProduct onClose={() => setShowAddProduct(false)} />
          </div>
        </div>
      )}
      {showEditProduct && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="h-screen w-screen m-1 bg-dark-2 p-6 rounded-lg">
            <EditProduct onClose={() => setShowEditProduct(false)} />
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        {/* Left-aligned Title */}
        <h2 className="text-lg font-bold">All Products</h2>

        {/* Right-aligned Search and Button */}
        <div className="flex items-center space-x-4">
          {/* Search Input */}
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

          {/* ADD PRODUCT Button */}
          <button
            className="bg-blue-light hover:bg-blue-dark text-white font-semibold px-6 py-2 border-hidden rounded flex items-center justify-center"
            onClick={() => setShowAddProduct(true)}
          >
            <Plus className="mr-2" /> {/* Lucide Plus icon */}
            ADD PRODUCT
          </button>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead className="border-b">
          <tr className="bg-gray-800 text-gray-300">
            <th className="p-3">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-3">ID</th>
            <th className="p-3">PRODUCT</th>
            <th className="p-3">CATEGORY</th>
            <th className="p-3">SUB-CATEGORY</th>
            <th className="p-3">SUB-CATEGORY-2</th>
            <th className="p-3">PRICE</th>
            <th className="p-3">STOCK</th>
            <th className="p-3">BRAND</th>
            <th className="p-3">PUBLISHED</th>
            <th className="p-3">ACTION</th>
          </tr>
        </thead>

        <tbody>
          {currentProducts.map((product) => (
            <tr
              key={product.id}
              className="border-b border-dashed border-gray-700"
            >
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleSelectProduct(product.id)}
                />
              </td>
              <td className="p-3">{product.id}</td>
              <td className="p-3 flex items-center space-x-3">
                <Image
                  src={product.Image}
                  alt={product.product}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span>{product.product}</span>
              </td>
              <td className="p-3">{product.category}</td>
              <td className="p-3">{product.subCategory}</td>
              <td className="p-3">{product.subCategory2}</td>
              <td className="p-3">${product.price}</td>
              <td className="p-3">{product.stock}</td>
              <td className="p-3">{product.brand}</td>
              <td className="p-3">{product.published}</td>
              <td className="p-3 flex space-x-2">
                <button className="flex items-center justify-center rounded-lg w-9 h-9 bg-blue-light-4 border border-hidden ease-out duration-200 hover:bg-blue-light hover:border-white text-dark hover:text-white">
                  <Eye size={16} />
                </button>
                <button className="flex items-center justify-center rounded-lg w-9 h-9 bg-green-light-4 border border-hidden ease-out duration-200 hover:bg-green-dark hover:border-white text-dark hover:text-white" onClick={() => setShowEditProduct(true)}>
                  <Pencil size={16} />
                </button>
                <button className="flex items-center justify-center rounded-lg w-9 h-9 bg-red-light-4 border border-hidden ease-out duration-200 hover:bg-red-dark hover:border-white text-dark hover:text-white">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <div className="mt-4">
          <button
            className="mt-6 bg-red-light-3 hover:bg-red-dark text-dark hover:text-white font-semibold px-6 py-2 border-hidden rounded"
            disabled={selectedProducts.length === 0}
          >
            DELETE SELECTED PRODUCTS
          </button>
        </div>
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
    </div>
  );
};

export default ProductList;
