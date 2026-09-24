"use client";

import { Edit, Trash2, AlertTriangle, CheckCircle, Clock, Undo2, BookmarkCheck, Ban } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteAdAction, toggleAdSoldAction, toggleAdReservedAction } from "@/lib/actions/ad";
import { useRouter } from "next/navigation";

interface AdActionsProps {
  adId: string;
  isSold?: boolean;
  isReserved?: boolean;
}

export default function AdActions({ adId, isSold = false, isReserved = false }: AdActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleDelete = () => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await deleteAdAction(adId);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        setShowDeleteModal(false);
        router.refresh();
      }
    });
  };

  const handleToggleSold = () => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await toggleAdSoldAction(adId);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleToggleReserved = () => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await toggleAdReservedAction(adId);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-center gap-1.5">
        {/* Toggle Sold Button */}
        <button
          onClick={handleToggleSold}
          disabled={isPending}
          className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50 ${
            isSold
              ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60"
          }`}
          title={isSold ? "Mark as Available / Active" : "Mark as Sold"}
        >
          {isSold ? (
            <>
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unmark Sold</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Mark Sold</span>
            </>
          )}
        </button>

        {/* Toggle Reserved Button (only if not sold) */}
        {!isSold && (
          <button
            onClick={handleToggleReserved}
            disabled={isPending}
            className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50 ${
              isReserved
                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                : "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/60"
            }`}
            title={isReserved ? "Cancel Reservation" : "Mark as Reserved"}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isReserved ? "Reserved" : "Reserve"}</span>
          </button>
        )}

        {/* Edit Button */}
        <Link
          href={`/ads/${adId}/edit`}
          className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
          title="Edit Ad"
        >
          <Edit className="w-4 h-4" />
        </Link>

        {/* Delete Button */}
        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={isPending}
          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete Ad"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-5">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-extrabold text-center text-slate-800 mb-3 tracking-tight">
                Delete Ad?
              </h3>
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
    </>
  );
}
