"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Zap, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white py-4 px-6 md:px-12 flex justify-between items-center shadow-sm border-b border-slate-100">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Zap className="text-white w-5 h-5 fill-white" />
          </div>
          <span className="text-xl font-bold text-indigo-700 tracking-tight">QUICKSELL</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-xs font-bold text-slate-600 tracking-wider">
          <Link href="/" className="hover:text-indigo-600 uppercase">HOME</Link>
          {session && (
            <Link href="/dashboard" className="hover:text-indigo-600 uppercase">DASHBOARD</Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* post your ads button */}
        <Link
          href={session ? "/ads/create" : "/login?callbackUrl=/ads/create"}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-md uppercase tracking-wider"
        >
          POST YOUR AD
        </Link>

        {status === "authenticated" && session?.user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs py-2 px-3 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              <span>{session.user.name || session.user.email}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{session.user.name}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{session.user.email}</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 font-medium hover:bg-red-50 flex items-center gap-2 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-slate-600 font-bold text-xs uppercase tracking-wider hover:text-indigo-600 transition"
          >
            LOGIN
          </Link>
        )}
      </div>
    </header>
  );
}
