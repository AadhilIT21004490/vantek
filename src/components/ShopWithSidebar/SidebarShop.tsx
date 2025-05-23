// "use client";
// import React, { useState } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import categoryData from "@/data/van_parts_categories.json"; // adjust path

// const SidebarShop = () => {
//   const [openMain, setOpenMain] = useState<Record<string, boolean>>({});
//   const [openSub, setOpenSub] = useState<Record<string, boolean>>({});

//   const toggleMain = (key: string) => {
//     setOpenMain((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const toggleSub = (mainKey: string, subKey: string) => {
//     const fullKey = `${mainKey}-${subKey}`;
//     setOpenSub((prev) => ({ ...prev, [fullKey]: !prev[fullKey] }));
//   };

//   return (
//     <aside className="w-full max-w-[300px] p-4 space-y-4 bg-white rounded-md shadow">
//       {Object.entries(categoryData).map(([mainCategory, subCategories]) => (
//         <div key={mainCategory} className="border rounded-md">
//           {/* Main Category */}
//           <button
//             onClick={() => toggleMain(mainCategory)}
//             className="w-full flex justify-between items-center px-4 py-2 font-semibold text-left text-gray-800 hover:bg-gray-100"
//           >
//             <span>{mainCategory}</span>
//             {openMain[mainCategory] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//           </button>

//           {/* Sub Categories */}
//           {openMain[mainCategory] && (
//             <div className="px-4 py-2 space-y-2">
//               {Object.entries(subCategories).map(([subCat, subSubArray]) => {
//                 const fullKey = `${mainCategory}-${subCat}`;
//                 return (
//                   <div key={subCat}>
//                     <button
//                       onClick={() => toggleSub(mainCategory, subCat)}
//                       className="w-full text-left flex justify-between items-center font-medium text-sm text-gray-700 hover:text-blue-600"
//                     >
//                       <span>{subCat}</span>
//                       {openSub[fullKey] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//                     </button>

//                     {/* Sub Sub Category (checkboxes) */}
//                     {openSub[fullKey] && (
//                       <div className="ml-4 mt-1 space-y-1 text-sm">
//                         {(subSubArray as string[]).length > 0
//   ? (subSubArray as string[]).map((item) => (
//       <label key={item} className="flex items-center space-x-2">
//         <input type="checkbox" className="accent-blue-600" />
//         <span>{item}</span>
//       </label>
//     ))
//   : (
//       <label className="flex items-center space-x-2 text-sm">
//         <input type="checkbox" className="accent-blue-600" />
//         <span>All</span>
//       </label>
//     )}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       ))}
//     </aside>
//   );
// };

// export default SidebarShop;
"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import categoryData from "@/data/van_parts_categories.json";

const SidebarShop = () => {
  const [openMain, setOpenMain] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const handleMainToggle = (mainCat: string) => {
    setOpenMain(openMain === mainCat ? null : mainCat);
    setOpenSub(null); // close sub on new main
  };

  const handleSubToggle = (subCat: string) => {
    setOpenSub(openSub === subCat ? null : subCat);
  };

  const handleCheckboxChange = (
    main: string,
    sub: string,
    item: string,
    isAll: boolean = false
  ) => {
    const key = `${main}--${sub}`;
    const existing = selected[key] || [];

    let updated: string[];
    if (isAll) {
      const allValues = Object.values(
        categoryData[main][sub] || {}
      ) as string[];
      updated = allValues.length > 0 ? allValues : ["All"];
    } else {
      updated = existing.includes(item)
        ? existing.filter((i) => i !== item)
        : [...existing, item];
    }

    setSelected({ ...selected, [key]: updated });
  };

  const isAllChecked = (main: string, sub: string) => {
    const key = `${main}--${sub}`;
    const items = categoryData[main][sub];
    const flatItems = Object.values(items).flat();
    const selectedItems = selected[key] || [];

    return (
      flatItems.length === selectedItems.length &&
      flatItems.every((item) => selectedItems.includes(item))
    );
  };

  const isChecked = (main: string, sub: string, item: string) => {
    const key = `${main}--${sub}`;
    return selected[key]?.includes(item);
  };

  return (
    <div className="space-y-4 p-4 bg-white shadow-md rounded-xl">
      {Object.entries(categoryData).map(([main, subCategories]) => (
        <div key={main}>
          <button
            onClick={() => handleMainToggle(main)}
            className="w-full flex justify-between items-center font-medium"
          >
            <span>{main}</span>
            {openMain === main ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {openMain === main && (
            <div className="mt-2 pl-3">
              {Object.entries(subCategories).map(([sub, subSubArray]) => (
                <div key={sub} className="mt-2">
                  <button
                    onClick={() => handleSubToggle(sub)}
                    className="w-full flex justify-between items-center font-medium text-sm text-gray-700"
                  >
                    <span>{sub}</span>
                    {openSub === sub ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {openSub === sub && (
                    <div className="pl-4 mt-1 space-y-1">
                      {/* All Option */}
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isAllChecked(main, sub)}
                          onChange={() => handleCheckboxChange(main, sub, "All", true)}
                          className="accent-blue-600"
                        />
                        <span>All</span>
                      </label>

                      {/* SubSubCategories */}
                      {(subSubArray as string[]).length > 0 ? (
                        (subSubArray as string[]).map((item) => (
                          <label key={item} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isChecked(main, sub, item)}
                              onChange={() =>
                                handleCheckboxChange(main, sub, item)
                              }
                              className="accent-blue-600"
                            />
                            <span>{item}</span>
                          </label>
                        ))
                      ) : (
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={isChecked(main, sub, "All")}
                            onChange={() =>
                              handleCheckboxChange(main, sub, "All")
                            }
                            className="accent-blue-600"
                          />
                          <span>All</span>
                        </label>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SidebarShop;
