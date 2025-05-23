"use client";
import React, { useEffect, useState } from "react";
import { X, XIcon, Plus } from "lucide-react";
import ToggleSwitch from "@/components/Admin/ToggleSwitch";
import { useRouter } from "next/navigation";
import { quillModules } from "@/lib/quillModule";
import dynamic from "next/dynamic";
import vanPartsData from "@/data/van_parts_categories.json";
import Image from "next/image";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const EditProduct = ({ productId }: { productId: string, onClose }) => {
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [topSelling, setTopSelling] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory1, setSubCategory1] = useState("");
  const [subCategory2, setSubCategory2] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [existingVariants, setExistingVariants] = useState([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [variantDeletes, setVariantDeletes] = useState<string[]>([]);
  const [variants, setVariants] = useState([
    { name: "", actualPrice: 0, labelPrice: 0, stock: 0 },
  ]);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      if (res.ok) {
        const product = data.product;
        setProductCode(product.productCode);
        setProductName(product.name);
        setProductDescription(product.description);
        setTopSelling(product.topSellingProduct);
        setFeatured(product.featuredProduct);
        setVisible(product.isVisible);
        setMainCategory(product.mainCategory);
        setSubCategory1(product.subCategory1);
        setSubCategory2(product.subCategory2);
        // setExistingImages(product.images);
        setImages(product.images);
        setTags(product.tags);
        setVariants(product.variants);
        setExistingVariants(product.variants);
        console.log(product);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  //Adding categories
  const mainCategories = Object.keys(vanPartsData);
  const subCategories1 = mainCategory
    ? Object.keys(vanPartsData[mainCategory])
    : [];
  const subCategories2 =
    mainCategory && subCategory1
      ? vanPartsData[mainCategory][subCategory1]
      : [];

  //Initializing Functions

  const handleVariantChange = (
    index: number,
    key: string,
    value: string | number
  ) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [key]: value };
    setVariants(updated);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { name: "", actualPrice: 0, labelPrice: 0, stock: 0 },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    const removed = variants[index];
    if (removed._id) {
      setVariantDeletes((prev) => [...prev, removed._id]);
    }
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  const removeImage = (index: number) => {
    const removedImage = images[index];
    setDeletedImageUrls((prev) => [...prev, removedImage]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setBase64Images((prev) => prev.filter((_, i) => i !== index));
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  // Reset values
  const resetForm = () => {
    setProductCode("");
    setProductName("");
    setProductDescription("");
    setTopSelling(false);
    setFeatured(false);
    setMainCategory("");
    setSubCategory1("");
    setSubCategory2("");
    setImages([]);
    setBase64Images([]);
    setTags([]);
    setVariants([{ name: "", actualPrice: 0, labelPrice: 0, stock: 0 }]); // if using variant list
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    const variantAdds = variants.filter((v) => !v._id);
    const variantUpdates = variants.filter((v) => v._id);

    const payload = {
      action: "updateDetails",
     id: productId,
        productCode,
        name: productName,
        description: productDescription,
        mainCategory,
        subCategory1,
        subCategory2,
        tags,
        topSellingProduct: topSelling,
        featuredProduct: featured,
        isVisible: visible,
        newImages: base64Images,
        deletedImages: deletedImageUrls,
        variantAdds,
        variantUpdates,
        variantDeletes,
    };

    const res = await fetch("/api/admin/product", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log("update product results===",result);
    if (res.ok) {
      router.push("/admin/inventoryPage");
    } else {
      console.error(result.error || "Update failed");
    }
  };

  return (
    <div className="m-4 p-6 bg-gray-800 border border-warmGray-500/50 text-white rounded-lg">
      <h2 className="text-2xl font-semibold">Edit Product</h2>
      <form>
        <div className="bg-gray-800 p-6 rounded-lg mt-4 grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Product code */}
            <div>
              <label className="block mb-1">Product Code</label>
              <input
                type="text"
                required
                className="w-full p-2 rounded bg-meta-2 text-white"
                placeholder="Product Code"
                maxLength={10}
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
              <small className="text-gray-400">
                *Product Code should not exceed 10 characters
              </small>
            </div>

            <div>
              <label className="block mb-1">Product Name</label>
              <input
                type="text"
                required
                className="w-full p-2 rounded bg-meta-2 text-white"
                placeholder="Product Name"
                maxLength={100}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <small className="text-gray-400">
                *Product Name should not exceed 100 characters
              </small>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <select
                className="p-2 rounded bg-meta-2 text-white"
                value={mainCategory}
                onChange={(e) => setMainCategory(e.target.value)}
              >
                <option value="">Select Main Category</option>
                {mainCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                className="p-2 rounded bg-meta-2 text-white"
                value={subCategory1}
                onChange={(e) => setSubCategory1(e.target.value)}
                disabled={!mainCategory}
              >
                <option value="">Select Sub Category 1</option>
                {subCategories1.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>

              <select
                className="p-2 rounded bg-meta-2 text-white"
                value={subCategory2}
                onChange={(e) => setSubCategory2(e.target.value)}
                disabled={!subCategory1}
              >
                <option value="">Select Sub Category 2</option>
                {subCategories2.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <small className="sm text-reds-500">{error}</small>

            <label className="block mb-1">Product Description</label>
            <div className="bg-white p-1 rounded-md">
              <ReactQuill
                theme="snow"
                value={productDescription}
                onChange={setProductDescription}
                modules={quillModules}
                className="dark-quill text-gray-900"
              />
            </div>
            <small className="text-gray-400">
              *Add a rich description about the product (1500 characters max)
            </small>

            {/* <div>
              <label className="block mb-1">Tags</label>
              <input
                required
                value={tags}
                type="text"
                className="w-full p-2 rounded bg-meta-2 text-white"
                placeholder="Comma-separated tags (e.g. camper,bumper,roof)"
                maxLength={100}
              />
            </div> */}

            <div className="mb-4">
              <label className="block mb-1 font-medium">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-dark-3 text-white px-2 py-1 rounded-md flex items-center text-xs"
                  >
                    {tag}
                    <X
                      size={16}
                      className="ml-2 cursor-pointer"
                      onClick={() =>
                        setTags(tags.filter((_, i) => i !== index))
                      }
                    />
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="w-full p-2 rounded bg-meta-2 text-white"
                placeholder="Type a tag and press Enter or Comma"
                onKeyDown={(e) => {
                  if (
                    (e.key === "Enter" || e.key === ",") &&
                    e.currentTarget.value.trim()
                  ) {
                    e.preventDefault();
                    const newTag = e.currentTarget.value.trim();
                    if (!tags.includes(newTag)) {
                      setTags([...tags, newTag]);
                    }
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 pt-7">
            <div className="p-3 border border-dashed rounded-lg">
              <span className="font-bold text-white">Product Variants</span>

              {variants.map((v, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-end gap-4 mt-4"
                >
                  <div>
                    <label className="block text-white">Variant:</label>
                    <input
                      required
                      type="text"
                      className="p-2 rounded bg-meta-2 text-white w-35"
                      placeholder="Name"
                      value={v.name}
                      onChange={(e) =>
                        handleVariantChange(index, "name", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-white">Actual Price:</label>
                    <input
                      type="number"
                      className="p-2 rounded bg-meta-2 text-white w-28"
                      placeholder="Actual Price"
                      value={v.actualPrice}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "actualPrice",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-white">Label Price:</label>
                    <input
                      type="number"
                      className="p-2 rounded bg-meta-2 text-white w-28"
                      placeholder="Label Price"
                      value={v.labelPrice}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "labelPrice",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-white">Stock:</label>
                    <input
                      type="number"
                      className="p-2 rounded bg-meta-2 text-white w-20"
                      placeholder="Stock"
                      value={v.stock}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "stock",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-red-600 text-white border border-dashed"
                    onClick={() => handleRemoveVariant(index)}
                  >
                    <XIcon size={18} />
                  </button>
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-gray-900 rounded-md bg-emerald-200 hover:bg-emerald-500 mx-2 px-2 mt-4"
                  onClick={handleAddVariant}
                >
                  <Plus size={18} className="inline-block mr-1" />
                  Add Variant
                </button>
              </div>
            </div>

            {/* FROM HERE MODIFICATION STOPED */}
            <div>
              <label className="block mb-1 font-medium">Product Images</label>
              <div className="border-2 border-dashed p-6 text-center rounded bg-gray-700">
                <input
                  className="py-1.5 h-full ps-0 w-full"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (files) {
                      const fileArray = Array.from(files);

                      // Convert to preview URLs
                      const previewUrls = fileArray.map((file) =>
                        URL.createObjectURL(file)
                      );
                      setImages((prev) => [...prev, ...previewUrls]);

                      // Convert to base64 strings
                      const base64Strings = await Promise.all(
                        fileArray.map((file) => convertToBase64(file))
                      );
                      setBase64Images((prev) => [...prev, ...base64Strings]);
                    }
                  }}
                />
              </div>
              <small className="text-gray-400">
                *Image size should be 50 x 50 px
              </small>
              <br />
              <small className="text-red-500">{imageError}</small>

              <div className="flex flex-wrap mt-4 gap-2">
                {images.map((src, idx) => (
                  <div key={idx} className="relative">
                    <Image
                      className="rounded-lg bg-meta-5 bg-opacity-50"
                      src={src}
                      alt={`product image ${idx + 1}`}
                      width={100}
                      height={100}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-0 right-0 bg-red-600 rounded-full p-1 hover:bg-red-700"
                    >
                      <X className="text-white" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <div></div>
                <div className="mt-8">
                  <ToggleSwitch
                    label="Visible"
                    enabled={visible}
                    setEnabled={setVisible}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div></div>
                <div className="mt-8">
                  <ToggleSwitch
                    label="Top Selling Product"
                    enabled={topSelling}
                    setEnabled={setTopSelling}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div></div>
                <div className="mt-8">
                  <ToggleSwitch
                    label="Featured Product"
                    enabled={featured}
                    setEnabled={setFeatured}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Publish Details */}

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            onClick={handleSaveProduct}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded"
          >
            UPDATE PRODUCT
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded"
          >
            CLEAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
