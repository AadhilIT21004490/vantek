import React, { useState } from 'react';
import { 
  Download, 
  Edit, 
  ChevronRight, 
  ArrowDown, 
  ChevronLeft, 
  ChevronUp, 
  ChevronDown,
  Search 
} from 'lucide-react';

interface Order {
  id: string;
  orderId: string;
  customer: {
    name: string;
    avatar: string;
  };
  quantity: number;
  price: number;
  status: 'Shipped' | 'Canceled' | 'Under Process' | 'Pending' | 'Success';
  orderedDate: string;
}

const statusColors = {
  'Shipped': 'text-emerald-500 bg-emerald-500/10',
  'Canceled': 'text-red-light bg-red-dark/10',
  'Under Process': 'text-blues-500 bg-blues-500/10',
  'Pending': 'text-amber-500 bg-amber-500/10',
  'Success': 'text-emerald-500 bg-emerald-500/10'
};

const RecentOrdersTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const recentOrders: Order[] = [
    {
      id: '1',
      orderId: '#1537890',
      customer: {
        name: 'Simon Cowall',
        avatar: '/avatars/simon.jpg'
      },
      quantity: 1,
      price: 4320.29,
      status: 'Shipped',
      orderedDate: '25,Nov 2022'
    },
    {
      id: '2',
      orderId: '#1539078',
      customer: {
        name: 'Meisha Kerr',
        avatar: '/avatars/meisha.jpg'
      },
      quantity: 1,
      price: 6745.99,
      status: 'Canceled',
      orderedDate: '29,Nov 2022'
    },
    {
      id: '3',
      orderId: '#1539832',
      customer: {
        name: 'Jessica',
        avatar: '/avatars/jessica.jpg'
      },
      quantity: 2,
      price: 1176.89,
      status: 'Under Process',
      orderedDate: '04,Dec 2022'
    },
    {
      id: '4',
      orderId: '#1539832',
      customer: {
        name: 'Amanda B',
        avatar: '/avatars/amanda.jpg'
      },
      quantity: 1,
      price: 1899.99,
      status: 'Shipped',
      orderedDate: '10,Dec 2022'
    },
    {
      id: '5',
      orderId: '#1538267',
      customer: {
        name: 'Jason Stathman',
        avatar: '/avatars/jason.jpg'
      },
      quantity: 1,
      price: 1867.29,
      status: 'Pending',
      orderedDate: '18,Dec 2022'
    },
    {
      id: '6',
      orderId: '#1537890',
      customer: {
        name: 'Khabib Hussain',
        avatar: '/avatars/khabib.jpg'
      },
      quantity: 1,
      price: 2439.99,
      status: 'Success',
      orderedDate: '24,Dec 2022'
    },
  ];

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const getSortedOrders = () => {
    if (!sortBy) return recentOrders;
    
    return [...recentOrders].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'orderId':
          valueA = a.orderId;
          valueB = b.orderId;
          break;
        case 'customer':
          valueA = a.customer.name;
          valueB = b.customer.name;
          break;
        case 'quantity':
          valueA = a.quantity;
          valueB = b.quantity;
          break;
        case 'price':
          valueA = a.price;
          valueB = b.price;
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        case 'orderedDate':
          valueA = new Date(a.orderedDate.split(',')[1] + ' ' + a.orderedDate.split(',')[0]).getTime();
          valueB = new Date(b.orderedDate.split(',')[1] + ' ' + b.orderedDate.split(',')[0]).getTime();
          break;
        default:
          return 0;
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowDown size={14} className="ml-1 opacity-30" />;
    return sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />;
  };

  return (
    <div className="bg-[#202020] border border-gray-600 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-6">
        <div className="flex items-center">
          <div className="w-1 h-5 bg-blues-500 mr-2"></div>
          <h2 className="text-white font-medium">Recent Orders</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders"
              className="bg-gray-7 text-gray-5 text-sm border border-gray-6 rounded-md pl-9 pr-4 py-1.5 w-64 focus:outline-none focus:ring-1 focus:ring-purple-light-4"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-light-1" size={16} />
          </div>
          <button className="bg-purple-light-2 hover:bg-purple-light-4 text-white text-sm px-3 py-1.5 rounded-md flex items-center">
            Sort By <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-6 text-gray-3 text-xs">
              
              <th 
                className="p-3 text-left cursor-pointer" 
                onClick={() => handleSort('orderId')}
              >
                <div className="flex items-center">
                  Order Id
                  {renderSortIcon('orderId')}
                </div>
              </th>
              <th 
                className="p-3 text-left cursor-pointer" 
                onClick={() => handleSort('customer')}
              >
                <div className="flex items-center">
                  Customer
                  {renderSortIcon('customer')}
                </div>
              </th>
              <th 
                className="p-3 text-left cursor-pointer" 
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center">
                  No.of Itmes
                  {renderSortIcon('quantity')}
                </div>
              </th>
              <th 
                className="p-3 text-left cursor-pointer" 
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Price
                  {renderSortIcon('price')}
                </div>
              </th>
              <th 
                className="p-3 text-left cursor-pointer" 
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {renderSortIcon('status')}
                </div>
              </th>
              <th 
                className="p-3 text-left cursor-pointer" 
                onClick={() => handleSort('orderedDate')}
              >
                <div className="flex items-center">
                  Ordered Date
                  {renderSortIcon('orderedDate')}
                </div>
              </th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {getSortedOrders().map((order) => (
              <tr 
                key={order.id} 
                className="border-b border-gray-6 text-white hover:bg-gray-6/50 transition-colors"
              >
                
                <td className="p-3">
                  <span className="text-emerald-300">{order.orderId}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-5 overflow-hidden flex items-center justify-center mr-2 text-xs">
                      {order.customer.avatar ? (
                        <img src="/api/placeholder/32/32" alt={order.customer.name} className="w-full h-full object-cover" />
                      ) : (
                        order.customer.name.charAt(0)
                      )}
                    </div>
                    <span>{order.customer.name}</span>
                  </div>
                </td>
                <td className="p-3">{order.quantity}</td>
                <td className="p-3">${order.price.toFixed(2)}</td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3">{order.orderedDate}</td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <button className="p-1 text-emerald-500 hover:bg-emerald-900 hover:text-white rounded">
                      <Download size={18} />
                    </button>
                    <button className="p-1 text-violet-500 hover:bg-violet-900 hover:text-white rounded">
                      <Edit size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-gray-6">
        <div className="flex items-center text-sm text-gray-3">
          Showing {recentOrders.length} Entries <ChevronRight size={14} className="ml-1" />
        </div>
        <div className="flex items-center space-x-1">
          <button className="flex items-center justify-center w-8 h-8 rounded text-gray-3 hover:bg-gray-6">
            <ChevronLeft size={18} />
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded bg-violet-600 text-white">
            1
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded text-gray-3 hover:bg-gray-6">
            2
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded text-gray-3 hover:bg-gray-6">
            next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersTable;