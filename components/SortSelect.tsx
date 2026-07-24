"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface SortSelectProps {
  currentSort: string;
}

export default function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`/ads?${params.toString()}`);
  };

  return (
    <select
      name="sort"
      value={currentSort}
      onChange={(e) => handleSortChange(e.target.value)}
      className="bg-white border border-slate-200 rounded-full px-4 py-2 text-[11px] font-bold text-slate-700 outline-none shadow-sm uppercase tracking-wider cursor-pointer focus:ring-2 focus:ring-indigo-500"
    >
      <option value="newest">DATE: NEWEST FIRST</option>
      <option value="oldest">DATE: OLDEST FIRST</option>
      <option value="price_asc">PRICE: LOW TO HIGH</option>
      <option value="price_desc">PRICE: HIGH TO LOW</option>
    </select>
  );
}
