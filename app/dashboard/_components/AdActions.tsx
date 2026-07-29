"use client";

import { Edit, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteAdAction } from "@/lib/actions/ad";
import { useRouter } from "next/navigation";

export default function AdActions({ adId }: { adId: string }) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleDelete = () => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await deleteAdAction(adId);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        setShowModal(false);
        router.refresh();
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Link
          href={`/ads/${adId}/edit`}
          className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
          title="Edit Ad"
        >
          <Edit className="w-4 h-4" />
        </Link>
        <button
          onClick={() => setShowModal(true)}
          disabled={isPending}
          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete Ad"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-5">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-extrabold text-center text-slate-800 mb-3 tracking-tight">Delete Ad?</h3>
              <p className="text-sm text-center text-slate-500 mb-8 leading-relaxed">
                Are you sure you want to delete this ad? This action is permanent and cannot be undone.
              </p>
              
              {errorMsg && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl text-center">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
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
    </>
  );
}
