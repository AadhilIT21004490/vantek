import { Edit, Eye } from "lucide-react";
import React from "react";

const OrderActions = ({ toggleEdit, toggleDetails }: any) => {
  return (
    <>
      <button
        onClick={toggleDetails}
        className="hover:bg-gray-2 rounded-sm p-2"
      >
        <Eye size={18} />
      </button>
    </>
  );
};

export default OrderActions;
