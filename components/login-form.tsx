"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff } from "lucide-react";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login(username, password);

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        toast.success("Login berhasil!");
        setTimeout(() => router.push("/dashboard-full"), 1000);
      } else {
        toast.error("Login gagal: token tidak diterima");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Terjadi kesalahan saat login.";
      toast.error("Login gagal", { description: msg });
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-green-300",
        className
      )}
      {...props}
    >
      <div className="bg-white/20 backdrop-blur-lg rounded-lg shadow-xl p-10 w-full max-w-sm text-green-900">
        {/* Icon circle */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-5 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 bg-green-100 text-green-900 placeholder-green-800"
              required
            />
            <User className="absolute left-3 top-2.5 text-green-700" size={18} />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 bg-green-100 text-green-900 placeholder-green-800"
              required
            />
            <Lock className="absolute left-3 top-2.5 text-green-700" size={18} />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-green-700 focus:outline-none"
              aria-label="Toggle Password Visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm text-green-900">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline text-green-900">
              Forgot Password?
            </a>
          </div>

          {/* Button */}
          <Button
            type="submit"
            className="w-full bg-purple-900 text-white hover:bg-purple-800"
          >
            LOGIN
          </Button>

          {/* Register */}
          <p className="text-center text-sm text-green-900">
            Belum punya akun?{" "}
            <Link href="/register" className="underline hover:no-underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
