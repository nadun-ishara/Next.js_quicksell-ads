"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { createAdAction } from "@/lib/actions/ad";

interface Category {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
}

interface CreateAdFormProps {
  categories: Category[];
  locations: Location[];
}

export default function CreateAdForm({ categories, locations }: CreateAdFormProps) {
  const [state, formAction, isPending] = useActionState(createAdAction, null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const combinedFiles = [...images, ...filesArray].slice(0, 4); // Max 4
      
      setImages(combinedFiles);
      
      const previews = combinedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  return (
    <form
      action={formAction}
      className="space-y-6 bg-white p-6 sm:p-10"
    >
      {state?.error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
          Ad Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          placeholder="e.g. iPhone 15 Pro Max 256GB"
          className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-all"
        />
        {state?.errors?.title && (
          <p className="text-xs text-red-500 mt-1">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue=""
            className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-all"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {state?.errors?.categoryId && (
            <p className="text-xs text-red-500 mt-1">{state.errors.categoryId[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="locationId" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
            Location <span className="text-red-500">*</span>
          </label>
          <select
            id="locationId"
            name="locationId"
            required
            defaultValue=""
            className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-all"
          >
            <option value="" disabled>Select a location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          {state?.errors?.locationId && (
            <p className="text-xs text-red-500 mt-1">{state.errors.locationId[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
          Price (LKR) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          id="price"
          name="price"
          required
          placeholder="e.g. 150000"
          className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-all"
        />
        {state?.errors?.price && (
          <p className="text-xs text-red-500 mt-1">{state.errors.price[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          placeholder="Describe your item in detail..."
          className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-all resize-y"
        />
        {state?.errors?.description && (
          <p className="text-xs text-red-500 mt-1">{state.errors.description[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-xs">
          UPLOAD IMAGES <span className="text-red-500">*</span>
        </label>
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-3 text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <p className="text-sm font-bold text-slate-700 mb-1">Click to select images</p>
          <p className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">* MAX 4 IMAGES ALLOWED</p>
          
          <input
            type="file"
            name="images"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        {state?.errors?.images && (
          <p className="text-xs text-red-500 mt-2">{state.errors.images[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed uppercase tracking-wider text-sm mt-4"
      >
        {isPending ? "Posting Advertisement..." : "POST ADVERTISEMENT"}
      </button>
    </form>
  );
}
