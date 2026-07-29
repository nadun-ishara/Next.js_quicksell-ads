"use client";

import { useState, useTransition } from "react";
import { createCategoryAction, deleteCategoryAction } from "@/lib/actions/admin";
import { Folder, FolderPlus, Trash2, ChevronRight, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children: Category[];
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const router = useRouter();

  //filter parent cat
  const rootCategories = categories.filter((c) => !c.parentId);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;

    startTransition(async () => {
      const res = await createCategoryAction(formData);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        form.reset();
        router.refresh();
      }
    });
  };

  const confirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (!categoryToDelete) return;
    
    setErrorMsg("");
    startTransition(async () => {
      const res = await deleteCategoryAction(categoryToDelete);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        setShowDeleteModal(false);
        setCategoryToDelete(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Create Form */}
      <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
        <div className="flex items-center gap-2 mb-6">
          <FolderPlus className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-800">Add New Category</h2>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g. Electronics"
            />
          </div>

          <div>
            <label htmlFor="parentId" className="block text-sm font-medium text-slate-700 mb-1">
              Parent Category (Optional)
            </label>
            <select
              id="parentId"
              name="parentId"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
            >
              <option value="">None (Root Category)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Create Category"
            )}
          </button>
        </form>
      </div>

      {/* Category List */}
      <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <Folder className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-800">Categories Hierarchy</h2>
        </div>

        <div className="p-4">
          {rootCategories.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No categories created yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {rootCategories.map((category) => (
                <li key={category.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-800 text-lg flex items-center gap-2">
                      <Folder className="w-4 h-4 text-slate-400" />
                      {category.name}
                    </div>
                    <button
                      onClick={() => confirmDelete(category.id)}
                      disabled={isPending}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subcategories */}
                  {category.children && category.children.length > 0 && (
                    <ul className="mt-3 ml-2 pl-4 border-l-2 border-indigo-100 space-y-2">
                      {category.children.map((sub) => (
                        <li key={sub.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                            {sub.name}
                          </div>
                          <button
                            onClick={() => confirmDelete(sub.id)}
                            disabled={isPending}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                            title="Delete Subcategory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-5">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-extrabold text-center text-slate-800 mb-3 tracking-tight">Delete Category?</h3>
              <p className="text-sm text-center text-slate-500 mb-8 leading-relaxed">
                Are you sure you want to delete this category? This action is permanent. Make sure it has no active ads or child categories.
              </p>
              
              {errorMsg && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl text-center">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isPending}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors disabled:opacity-50 uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-50 uppercase tracking-wider text-xs"
                >
                  {isPending ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
