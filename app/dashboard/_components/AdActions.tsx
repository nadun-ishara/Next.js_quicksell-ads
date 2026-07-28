"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteAdAction } from "@/lib/actions/ad";
import { useRouter } from "next/navigation";

export default function AdActions({ adId }: { adId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this ad? This action cannot be undone.")) {
      startTransition(async () => {
        const res = await deleteAdAction(adId);
        if (res?.error) {
          alert(res.error);
        } else {
          router.refresh();
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        href={`/ads/${adId}/edit`}
        className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
        title="Edit Ad"
      >
        <Edit className="w-4 h-4" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete Ad"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
