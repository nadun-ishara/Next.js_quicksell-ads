"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, User, ArrowRight, UserPlus } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] p-8 md:p-10 max-w-md w-full shadow-2xl border border-slate-100/80 transition-all">
        
        {/* Header Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-sm">
              <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <span className="text-2xl font-extrabold text-slate-800 tracking-tight">QUICKSELL</span>
          </Link>
        </div>

        {mode === "login" ? (
          /* Login Card View */
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-extrabold text-slate-800">Welcome Back</h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Enter your credentials to access your account
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500 w-4 h-4" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-indigo-50/40 border border-indigo-200/80 text-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Password
                  </label>
                  <a href="#" className="text-[11px] font-bold text-indigo-600 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••"
                    className="w-full pl-10 pr-4 py-3 bg-indigo-50/40 border border-indigo-200/80 text-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{loading ? "Signing In..." : "Sign In"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative bg-white px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                OR
              </span>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Sign in with Google
            </button>

            {/* Footer switch to register */}
            <p className="text-center text-xs text-slate-400 mt-6 font-medium">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className="text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Sign up now
              </button>
            </p>
          </div>
        ) : (
          /* Register Card View */
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-extrabold text-slate-800">Create Account</h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Join us to start posting your advertisements
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500 w-4 h-4" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-indigo-50/40 border border-indigo-200/80 text-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Passwords (2 Columns) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••"
                    className="w-full px-3 py-3 bg-indigo-50/40 border border-indigo-200/80 text-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{loading ? "Creating Account..." : "Create Account"}</span>
                <UserPlus className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative bg-white px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                OR
              </span>
            </div>

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Sign up with Google
            </button>

            {/* Footer switch to login */}
            <p className="text-center text-xs text-slate-400 mt-6 font-medium">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Log in here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
