import React from "react";
import { MoreVertical } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  amount: number;
  initials: string;
  bgColor: string;
  textColor: string;
}

const TopCustomerTable = () => {
  const customers: Customer[] = [
    {
      id: "1",
      name: "Michael Jordan",
      email: "michael.jordan@example.com",
      amount: 2893,
      initials: "MJ",
      bgColor: "bg-blue-500",
      textColor: "text-white",
    },
    {
      id: "2",
      name: "Emigo Klaren",
      email: "emigo.klaren@gmail.com",
      amount: 4289,
      initials: "EK",
      bgColor: "bg-yellow-500",
      textColor: "text-black",
    },
    {
      id: "3",
      name: "Randy Origoan",
      email: "randy.origoan@gmail.com",
      amount: 6347,
      initials: "RO",
      bgColor: "bg-orange-400",
      textColor: "text-white",
    },
    {
      id: "4",
      name: "George Pieterson",
      email: "george.pieterson@gmail.com",
      amount: 3894,
      initials: "GP",
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
    {
      id: "5",
      name: "Kiara Advain",
      email: "kiaraadvain214@gmail.com",
      amount: 2679,
      initials: "KA",
      bgColor: "bg-purple-500",
      textColor: "text-white",
    },
    {
      id: "6",
      name: "Alvin Malvin",
      email: "kiaraadvain214@gmail.com",
      amount: 2548,
      initials: "KA",
      bgColor: "bg-purple-500",
      textColor: "text-white",
    },
    {
      id: "7",
      name: "Robert Jr",
      email: "kiaraadvain214@gmail.com",
      amount: 1658,
      initials: "KA",
      bgColor: "bg-purple-500",
      textColor: "text-white",
    },
    {
      id: "8",
      name: "James Rafeeki",
      email: "kiaraadvain214@gmail.com",
      amount: 1500,
      initials: "KA",
      bgColor: "bg-purple-500",
      textColor: "text-white",
    },
    {
      id: "9",
      name: "Dr.Doom",
      email: "kiaraadvain214@gmail.com",
      amount: 1000,
      initials: "KA",
      bgColor: "bg-yellow-500",
      textColor: "text-white",
    },
  ];

  return (
    <div className="w-full bg-[#202020] border border-gray-600 text-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4 border-b border-gray-5 pb-2">
        <h2 className="text-lg font-semibold border-l-4 border-l-blue-500 pl-2">
          Top Customers
        </h2>
        <button className="p-1 hover:bg-gray-800 rounded-full">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Customer details div */}
      <div className="space-y-3 text-sm overflow-y-auto pr-2">
        {customers.slice(0, 9).map((customer) => (
          <div
            key={customer.id}
            className="flex items-center justify-between hover:bg-gray-800 p-2 rounded-md transition-colors duration-150 ease-in-out cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${customer.bgColor}`}
              >
                <span className={`text-xs font-medium ${customer.textColor}`}>
                  {customer.initials}
                </span>
              </div>
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-gray-400 text-sm">{customer.email}</p>
              </div>
            </div>
            <div className="font-semibold text-sm">
              ${customer.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCustomerTable;
