import React, { useRef, useEffect } from "react";
import OrderDetails from "./OrderDetails";
import EditOrder from "./EditOrder";
import { X } from "lucide-react";

const OrderModal = ({ showDetails, showEdit, toggleModal, order }: any) => {
  if (!showDetails && !showEdit) {
    return null;
  }

  return (
    <>
      <div
        className={`backdrop-filter-sm visible fixed left-0 top-0 z-[99999] flex min-h-screen w-full justify-center items-center bg-[#000]/40 px-4 py-1 sm:px-8`}
      >
        <div
          className="shadow-7 relative w-fit h-fit transform rounded-[15px] bg-white transition-all flex flex-col justify-center items-center 
                  scale-50 sm:scale-75 md:scale-90"
        >

          {/* <div
  className="shadow-7 relative w-full max-w-[95vw] sm:max-w-[600px] transform rounded-[15px] bg-white transition-all 
             flex flex-col justify-center items-center scale-90 sm:scale-100"
> */}

          <button
            onClick={() => toggleModal(false)}
            className="text-body absolute -right-6 -top-6 z-[9999] flex h-11.5 w-11.5 items-center justify-center rounded-full border-2 border-stroke bg-white hover:text-dark"
          >
            <X />
          </button>

          <>
            {showDetails && <OrderDetails orderItem={order} />}
          </>
        </div>
      </div>
    </>
  );
};

export default OrderModal;
