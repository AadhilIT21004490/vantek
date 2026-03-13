"use client";
import { useEffect, useState, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import categoryData from "@/data/van_parts_categories.json";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type SidebarShopProps = {
  resetSidebar: boolean;
  setResetSidebar: (v: boolean) => void;
  initialMainCat?: string | null;
  initialSubCat?: string | null;
};

const SidebarShop = ({
  resetSidebar,
  setResetSidebar,
  initialMainCat,
  initialSubCat,
}: SidebarShopProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [openMain, setOpenMain] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);

  // Helper to read currently selected subCategory2 items from the URL
  const getSelectedItems = useCallback((): string[] => {
    const subCat2Param = searchParams.get("subCategory2");
    if (!subCat2Param) return [];
    return subCat2Param.split(",").filter((item) => item.trim() !== "");
  }, [searchParams]);

  // Read current mainCategory and subCategory1 from URL
  const currentMainCategory = searchParams.get("mainCategory");
  const currentSubCategory1 = searchParams.get("subCategory1");

  // When navbar sets a category, auto-open the matching sections in the sidebar
  useEffect(() => {
    if (initialMainCat) {
      setOpenMain(initialMainCat);
    }
    if (initialSubCat) {
      setOpenSub(initialSubCat);
    }
  }, [initialMainCat, initialSubCat]);

  // When "Clear All" is pressed, collapse all open sections
  useEffect(() => {
    if (resetSidebar) {
      setOpenMain(null);
      setOpenSub(null);
      setResetSidebar(false);
    }
  }, [resetSidebar, setResetSidebar]);

  const handleMainToggle = (mainCat: string) => {
    // If a main category is clicked, it becomes visual the open one, but we don't route immediately
    // unless you want clicking a main category to filter as well.
    // Based on previous code, they only push to API when sub items are selected or all.
    setOpenMain(openMain === mainCat ? null : mainCat);
    setOpenSub(null); // close sub on new main
  };

  const handleSubToggle = (subCat: string) => {
    setOpenSub(openSub === subCat ? null : subCat);
  };

  const updateUrlParams = (main: string, sub: string, newItems: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Always set main and sub1 when editing sidebar filters in that block
    params.set("mainCategory", main);
    params.set("subCategory1", sub);
    
    if (newItems.length > 0) {
      params.set("subCategory2", newItems.join(","));
    } else {
      params.delete("subCategory2");
    }

    // Reset pagination to page 1 on filter changes
    params.set("page", "1");
    params.set("isVisible", "true");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCheckboxChange = (
    main: string,
    sub: string,
    item: string,
    isAll: boolean = false
  ) => {
    // If we click a checkbox in a category that isn't the currently filtered one computationally,
    // we assume the user is starting a NEW query in that category.
    let existing = getSelectedItems();
    
    // If the category they click on doesn't match the current URL category, then
    // their existings list should be treated as empty for this new category.
    if (currentMainCategory !== main || currentSubCategory1 !== sub) {
      existing = [];
    }

    let updated: string[];
    if (isAll) {
      const allValues = (categoryData as Record<string, Record<string, string[]>>)[main][sub];
      // If all are already selected, deselect all; otherwise select all
      const allSelected = allValues.every((v) => existing.includes(v));
      updated = allSelected ? [] : allValues;
    } else {
      updated = existing.includes(item)
        ? existing.filter((i) => i !== item)
        : [...existing, item];
    }

    updateUrlParams(main, sub, updated);
  };

  const isAllChecked = (main: string, sub: string) => {
    if (currentMainCategory !== main || currentSubCategory1 !== sub) return false;
    const allItems = (categoryData as Record<string, Record<string, string[]>>)[main][sub];
    const selectedItems = getSelectedItems();
    return allItems.length > 0 && allItems.every((item) => selectedItems.includes(item));
  };

  const isChecked = (main: string, sub: string, item: string): boolean => {
    if (currentMainCategory !== main || currentSubCategory1 !== sub) return false;
    return getSelectedItems().includes(item);
  };

  return (
    <div className="space-y-2 p-4 bg-white shadow-md rounded-xl">
      {Object.entries(categoryData as Record<string, Record<string, string[]>>).map(
        ([main, subCategories]) => (
          <div key={main} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
            <button
              onClick={() => handleMainToggle(main)}
              className={`w-full flex justify-between items-center font-medium py-1.5 transition-colors ${
                openMain === main ? "text-blue-600" : "text-gray-800 hover:text-blue-600"
              }`}
            >
              <span>{main}</span>
              {openMain === main ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {openMain === main && (
              <div className="mt-1 pl-3">
                {Object.entries(subCategories).map(([sub, subSubArray]) => (
                  <div key={sub} className="mt-1.5">
                    <button
                      onClick={() => handleSubToggle(sub)}
                      className={`w-full flex justify-between items-center text-sm py-1 transition-colors ${
                        openSub === sub
                          ? "text-blue-600 font-medium"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      <span>{sub}</span>
                      {openSub === sub ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </button>

                    {openSub === sub && (
                      <div className="pl-3 mt-1.5 space-y-1.5 pb-1">
                        {/* "All" toggle — selects/deselects all sub-options */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isAllChecked(main, sub)}
                            onChange={() =>
                              handleCheckboxChange(main, sub, "All", true)
                            }
                            className="accent-blue-600 w-3.5 h-3.5"
                          />
                          <span className="text-sm text-gray-500 italic">All</span>
                        </label>

                        {/* Individual sub-sub-category items */}
                        {subSubArray.length > 0 ? (
                          subSubArray.map((item) => (
                            <label
                              key={item}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked(main, sub, item)}
                                onChange={() =>
                                  handleCheckboxChange(main, sub, item)
                                }
                                className="accent-blue-600 w-3.5 h-3.5"
                              />
                              <span className="text-sm text-gray-600">{item}</span>
                            </label>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400 italic">No sub-options</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default SidebarShop;
