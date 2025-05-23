import React from 'react';
import { ShoppingBag, ShoppingCart, Shirt, Watch } from 'lucide-react';
import Image from 'next/image';

// Define the icon map first so we can reference its keys in the interface
const iconMap = {
  ShoppingBag: ShoppingBag,
  Shirt: Shirt,
  ShoppingCart: ShoppingCart,
  Watch: Watch,
};

// Now we can use keyof typeof iconMap safely
interface Product {
  id: number;
  name: string;
  category: string;
  inStock: boolean;
  totalSales: number;
  image: string;
}

const TopSellingProductsTable = () => {
  const products: Product[] = [
    {
      id: 1,
      name: 'VW T5 Fridge (24L)',
      category: 'VW-T5',
      inStock: true,
      totalSales: 5093,
      image: '/images/products/product-gen-bg-1.png',
    },
    {
        id: 2,
        name: 'VW T5 Coffee Maker (Compact)',
        category: 'VW-T5',
        inStock: false,
        totalSales: 2789,
        image: '/images/products/product-gen-bg-1.png',
      },
      {
        id: 3,
        name: 'VW T5 Portable Heater (12V)',
        category: 'VW-T5',
        inStock: true,
        totalSales: 3745,
        image: '/images/products/product-gen-bg-1.png',
      },
      {
        id: 4,
        name: 'VW T5 Roof Rack',
        category: 'VW-T5',
        inStock: true,
        totalSales: 1423,
        image: '/images/products/product-gen-bg-1.png',
      },
      {
        id: 5,
        name: 'VW T7 Bluetooth Speaker',
        category: 'VW-T7',
        inStock: true,
        totalSales: 8921,
        image: '/images/products/product-gen-bg-1.png',
      },
      {
        id: 6,
        name: 'VW T6.1 Camping Chair',
        category: 'VW-T6.1',
        inStock: false,
        totalSales: 2204,
        image: '/images/products/product-gen-bg-1.png',
      },
      
  ];

  return (
    <div className="w-full h-full bg-[#202020] border border-gray-600 7 text-white text-sm p-4 rounded-lg shadow-lg">
      <div className="mb-4 border-b border-gray-6 pb-2">
        <h2 className="text-lg font-semibold flex items-center">
        <div className="w-1 h-5 bg-blues-500 mr-2"></div>
          Top Selling Products
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm border-b bg-gray-6 border-gray-5">
              <th className="py-3 px-4 font-medium">Image</th>
              <th className="py-3 px-4 font-medium">Product Name</th>
              <th className="py-3 px-4 font-medium">Category</th>
              <th className="py-3 px-4 font-medium text-right">Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr 
                key={product.id} 
                className="border-b border-gray-6 hover:bg-gray-6 transition-colors duration-150 ease-in-out"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-6">
                     <Image src={product.image} alt={product.name} width={50} height={50}/>
                  </div>
                </td>
                <td className="py-4 px-4">{product.name}</td>
                <td className="py-4 px-4">{product.category}</td>
                
                <td className="py-4 px-4 text-right font-medium">{product.totalSales.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingProductsTable;