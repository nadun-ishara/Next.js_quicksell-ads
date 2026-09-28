"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Zap,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Shield,
  Menu,
  X,
  PlusCircle,
  Heart,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState<number>(0);

  useEffect(() => {
    const updateSavedCount = () => {
      try {
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("fav_") && localStorage.getItem(key)) {
            count++;
          }
        }
        setSavedCount(count);
      } catch {
        // ignore
      }
    };

    updateSavedCount();

    window.addEventListener("quicksell:favorites-updated", updateSavedCount);
    window.addEventListener("storage", updateSavedCount);

    return () => {
      window.removeEventListener("quicksell:favorites-updated", updateSavedCount);
      window.removeEventListener("storage", updateSavedCount);
    };
  }, []);

  const isModerator = (session?.user as any)?.role === "MODERATOR";
  const userInitials = (session?.user?.name || session?.user?.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        {/* Brand & Left Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-2 rounded-xl text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Zap className="w-4 h-4 fill-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                QUICKSELL
              </span>
              <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500 -mt-1">
                Marketplace
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wider">
            <Link
              href="/"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 uppercase transition-colors py-1"
            >
              Home
            </Link>
            <Link
              href="/ads"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 uppercase transition-colors py-1"
            >
              Browse Ads
            </Link>
            {session && (
              <Link
                href="/dashboard"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 uppercase transition-colors py-1 flex items-center gap-1.5"
              >
                Dashboard
              </Link>
            )}
            {isModerator && (
              <div className="flex items-center gap-4 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  href="/admin"
                  className="hover:text-red-700 dark:hover:text-red-400 uppercase text-red-600 dark:text-red-400 transition-colors flex items-center gap-1 font-extrabold"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
                <Link
                  href="/admin?tab=CATEGORIES"
                  className="hover:text-red-700 dark:hover:text-red-400 uppercase text-red-600 dark:text-red-400 transition-colors"
                >
                  Categories
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer relative"
            title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
            )}
          </button>

          {/* Saved Ads / Favorites Link with Live Counter */}
          <Link
            href="/favorites"
            className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/40 transition-all flex items-center justify-center cursor-pointer group"
            title="Saved Ads"
          >
            <Heart className="w-4 h-4 transition-transform group-hover:scale-110" />
            {savedCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-xs">
                {savedCount > 99 ? "99+" : savedCount}
              </span>
            )}
          </Link>

          {/* Post Your Ad Button */}
          <Link
            href={session ? "/ads/create" : "/login?callbackUrl=/ads/create"}
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold px-3.5 sm:px-5 py-2.5 rounded-full shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all tracking-wider uppercase"
          >
            <PlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            <span className="hidden sm:inline">Post Ad</span>
            <span className="sm:hidden">Post</span>
          </Link>

          {/* User Profile / Login */}
          {status === "authenticated" && session?.user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-xs py-1.5 px-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center text-[11px] font-bold shadow-sm overflow-hidden">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userInitials}</span>
                  )}
                </div>
                <span className="hidden sm:inline-block max-w-[110px] truncate text-slate-800 dark:text-slate-200 font-medium">
                  {session.user.name || session.user.email}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 truncate">
                      {session.user.email}
                    </p>
                    {isModerator && (
                      <span className="mt-1.5 inline-block text-[9px] font-extrabold uppercase tracking-wider bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md border border-red-100 dark:border-red-900/60">
                        Moderator
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2.5 transition-colors font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      My Dashboard & Ads
                    </Link>

                    <Link
                      href="/favorites"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-rose-50/70 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-between transition-colors font-medium"
                    >
                      <span className="flex items-center gap-2.5">
                        <Heart className="w-4 h-4 text-rose-500" />
                        Saved Ads
                      </span>
                      {savedCount > 0 && (
                        <span className="text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-900/60">
                          {savedCount}
                        </span>
                      )}
                    </Link>

                    {isModerator && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-2.5 transition-colors font-medium"
                      >
                        <Shield className="w-4 h-4 text-red-500" />
                        Admin Panel
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 font-medium hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Home
            </Link>
            <Link
              href="/ads"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Browse All Ads
            </Link>
            <Link
              href="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                Saved Ads
              </span>
              {savedCount > 0 && (
                <span className="text-xs font-bold bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full">
                  {savedCount}
                </span>
              )}
            </Link>
            {session && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Dashboard
              </Link>
            )}
            {isModerator && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold"
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
