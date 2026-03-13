"use client";
import React, { useState } from "react";
import { X, XIcon, Plus, Loader2 } from "lucide-react";
import ToggleSwitch from "@/components/Admin/ToggleSwitch";
import Image from "next/image";
import { useRouter } from "next/navigation";
import vanPartsData from "@/data/van_parts_categories.json";
import dynamic from "next/dynamic";
import { quillModules } from "@/lib/quillModule";
import { toast, Toaster } from "sonner";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AddProduct = () => {
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [topSelling, setTopSelling] = useState(false);
  const [error, setError] = useState("");
  const [featured, setFeatured] = useState(false);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory1, setSubCategory1] = useState("");
  const [subCategory2, setSubCategory2] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Uploading images...");
  const [variants, setVariants] = useState([
    { name: "", actualPrice: 0, labelPrice: 0, stock: 0 },
  ]);

  const router = useRouter();

  const handleVariantChange = (index: number, key: string, value: string | number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [key]: value };
    setVariants(updated);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { name: "", actualPrice: 0, labelPrice: 0, stock: 0 }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setBase64Images((prev) => prev.filter((_, i) => i !== index));
  };

  // Compress to max 800px, retry with lower quality until under 7MB
  const compressAndConvertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const MAX_PX = 800;
        let { width, height } = img;
        if (width > MAX_PX || height > MAX_PX) {
          if (width > height) { height = Math.round((height * MAX_PX) / width); width = MAX_PX; }
          else { width = Math.round((width * MAX_PX) / height); height = MAX_PX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context unavailable"));
        ctx.drawImage(img, 0, 0, width, height);
        const MAX_BYTES = 7 * 1024 * 1024;
        let quality = 0.7;
        let base64 = canvas.toDataURL("image/jpeg", quality);
        while (base64.length > MAX_BYTES && quality > 0.1) {
          quality = Math.max(quality - 0.1, 0.1);
          base64 = canvas.toDataURL("image/jpeg", quality);
        }
        if (base64.length > MAX_BYTES) return reject(new Error("Image too large. Please use a smaller image."));
        resolve(base64);
      };
      img.onerror = reject;
      img.src = objectUrl;
    });
  };

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
    setVariants([{ name: "", actualPrice: 0, labelPrice: 0, stock: 0 }]);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (mainCategory.trim() === "") {
      setError("*Please select Main Category");
      return;
    }
    if (images.length === 0) {
      setImageError("Please upload at least 1 product image");
      return;
    }

    const productData = {
      productCode,
      name: productName,
      description: productDescription,
      mainCategory,
      subCategory1,
      subCategory2,
      tags,
      images: base64Images,
      variants,
      topSellingProduct: topSelling,
      featuredProduct: featured,
    };

    try {
      setIsSubmitting(true);
      setLoadingMessage("Uploading images...");

      const res = await fetch(
        `${process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BASEURL
          : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/admin/product`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        }
      );

      setLoadingMessage("Saving product details...");
      const data = await res.json();

      if (res.ok) {
        setLoadingMessage("Done!");
        toast.success("Product added successfully!");
        setError("");
        setImageError("");
        resetForm();
      } else {
        console.error("API error:", data.message);
        toast.error(data.message || "Failed to add product");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoadingMessage("Uploading images...");
    }
  };

  const mainCategories = Object.keys(vanPartsData);
  const subCategories1 = mainCategory ? Object.keys(vanPartsData[mainCategory]) : [];
  const subCategories2 = mainCategory && subCategory1 ? vanPartsData[mainCategory][subCategory1] : [];

  return (
    <div className="m-4 p-6 bg-dark text-white rounded-lg relative">
      <Toaster position="top-right" />

      {/* ✅ Full-screen loading overlay while saving */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-800 border border-gray-600 rounded-2xl px-10 py-8 flex flex-col items-center gap-5 shadow-2xl min-w-[280px]">
            <Loader2 size={52} className="text-green-400 animate-spin" />
            <div className="text-center">
              <p className="text-white text-lg font-semibold">{loadingMessage}</p>
              <p className="text-gray-400 text-sm mt-1">Please don't close this page</p>
            </div>
            {/* Indeterminate progress bar */}
            <div className="w-56 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-green-400 rounded-full animate-[slide_1.5s_ease-in-out_infinite]"
                style={{ animation: "slideProgress 1.5s ease-in-out infinite" }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>

      <h2 className="text-2xl font-semibold">Add Products</h2>
      <div className="flex justify-end">
        <button
          type="button"
          disabled={isSubmitting}
          className="rounded-2xl bg-reds-500 w-fit p-2 flex flex-end disabled:opacity-50"
          onClick={() => router.push("/admin/inventory")}
        >
          <X />
        </button>
      </div>

      <form onSubmit={handleSaveProduct}>
        <div className="bg-gray-800 p-6 rounded-lg mt-4 grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
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
              <small className="text-gray-400">*Product Code should not exceed 10 characters</small>
            </div>

            <div>
              <label className="block mb-1">Product Name</label>
              <input
                type="text"
                required
                className="w-full p-2 rounded bg-meta-2 text-white"
                placeholder="Product Name"
                maxLength={200}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <small className="text-gray-400">*Product Name should not exceed 100 characters</small>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <select
                className="p-2 rounded bg-meta-2 text-white"
                value={mainCategory}
                onChange={(e) => { setMainCategory(e.target.value); setSubCategory1(""); setSubCategory2(""); }}
              >
                <option value="">Select Main Category</option>
                {mainCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              <select
                className="p-2 rounded bg-meta-2 text-white"
                value={subCategory1}
                onChange={(e) => { setSubCategory1(e.target.value); setSubCategory2(""); }}
                disabled={!mainCategory}
              >
                <option value="">Select Sub Category 1</option>
                {subCategories1.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
              </select>

              <select
                className="p-2 rounded bg-meta-2 text-white"
                value={subCategory2}
                onChange={(e) => setSubCategory2(e.target.value)}
                disabled={!subCategory1}
              >
                <option value="">Select Sub Category 2</option>
                {subCategories2.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <small className="text-reds-500">{error}</small>

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
            <small className="text-gray-400">*Add a rich description about the product (1500 characters max)</small>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-dark-3 text-white px-2 py-1 rounded-md flex items-center text-xs">
                    {tag}
                    <X size={16} className="ml-2 cursor-pointer" onClick={() => setTags(tags.filter((_, i) => i !== index))} />
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="w-full p-2 rounded bg-meta-2 text-white"
                placeholder="Type a tag and press Enter or Comma"
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === ",") && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const newTag = e.currentTarget.value.trim();
                    if (!tags.includes(newTag)) setTags([...tags, newTag]);
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
                <div key={index} className="flex flex-wrap items-end gap-4 mt-4">
                  <div>
                    <label className="block text-white">Variant:</label>
                    <input required type="text" className="p-2 rounded bg-meta-2 text-white w-35" placeholder="Name" value={v.name} onChange={(e) => handleVariantChange(index, "name", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-white">Actual Price:</label>
                    <input type="number" className="p-2 rounded bg-meta-2 text-white w-28" placeholder="Actual Price" value={v.actualPrice} onChange={(e) => handleVariantChange(index, "actualPrice", Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-white">Label Price:</label>
                    <input type="number" className="p-2 rounded bg-meta-2 text-white w-28" placeholder="Label Price" value={v.labelPrice} onChange={(e) => handleVariantChange(index, "labelPrice", Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-white">Stock:</label>
                    <input type="number" className="p-2 rounded bg-meta-2 text-white w-20" placeholder="Stock" value={v.stock} onChange={(e) => handleVariantChange(index, "stock", Number(e.target.value))} />
                  </div>
                  <button type="button" className="rounded-md p-2 hover:bg-red-600 text-white border border-dashed" onClick={() => handleRemoveVariant(index)}>
                    <XIcon size={18} />
                  </button>
                </div>
              ))}
              <div className="flex justify-end">
                <button type="button" className="text-gray-900 rounded-md bg-emerald-200 hover:bg-emerald-500 mx-2 px-2 mt-4" onClick={handleAddVariant}>
                  <Plus size={18} className="inline-block mr-1" />
                  Add Variant
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1">Product Images</label>
              <div className="border-2 border-dashed p-6 text-center rounded bg-gray-700">
                <input
                  className="py-1.5 h-full ps-0 w-full"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files) return;
                    const fileArray = Array.from(files);
                    const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
                    setImages((prev) => [...prev, ...previewUrls]);
                    const compressed = await Promise.all(fileArray.map((file) => compressAndConvertToBase64(file)));
                    setBase64Images((prev) => [...prev, ...compressed]);
                  }}
                />
              </div>
              <small className="text-red-400">*Each image's size should be less than 5MB</small>
              <br />
              <small className="text-red-500">{imageError}</small>

              <div className="flex flex-wrap mt-4 gap-2">
                {images.map((src, idx) => (
                  <div key={idx} className="relative">
                    <Image className="rounded-lg bg-meta-5 bg-opacity-50 object-contain" src={src} alt={`product preview ${idx + 1}`} width={100} height={100} />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-600 rounded-full p-1 hover:bg-red-700">
                      <X className="text-white" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="mt-8">
                <ToggleSwitch label="Top Selling Product" enabled={topSelling} setEnabled={setTopSelling} />
              </div>
              <div className="mt-8">
                <ToggleSwitch label="Featured Product" enabled={featured} setEnabled={setFeatured} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6 ml-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-light-3 hover:bg-blue-light-2 text-dark font-semibold px-6 py-2 border-hidden rounded disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              "SAVE PRODUCT"
            )}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            className="bg-red-light-3 hover:bg-red-dark text-dark hover:text-white font-semibold px-6 py-2 border-hidden rounded disabled:opacity-50"
            onClick={resetForm}
          >
            CLEAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;