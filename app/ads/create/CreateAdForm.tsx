"use client";

import { useActionState } from "react";
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

  return (
    <form
      action={formAction}
      className="space-y-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
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
        <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
          Image URL (Optional)
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-all"
        />
        {state?.errors?.imageUrl && (
          <p className="text-xs text-red-500 mt-1">{state.errors.imageUrl[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        {isPending ? "Posting Advertisement..." : "Post Advertisement"}
      </button>
    </form>
  );
}
