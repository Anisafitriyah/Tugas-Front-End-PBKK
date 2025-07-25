"use client";

import React, { useState } from "react";
import Link from "next/link"; // <-- tambahkan ini
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      const msg =
        error.response?.data?.message || "Terjadi kesalahan saat login.";
      toast.error("Login gagal", { description: msg });
    }
  };

  return (
    <div
      className={cn(
        "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="bg-blue-600 p-6 rounded-t-xl flex flex-col items-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
          <img src="/logos.png" alt="Avatar" className="w-14 h-14" />
        </div>
        <p className="text-white font-semibold mt-3">Login</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <Label
            htmlFor="username"
            className="text-sm font-medium text-gray-700"
          >
            Nomor Telepon / Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Masukkan nomor telepon atau username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 flex justify-between items-center"
          >
            Kata Sandi
            <a
              href="#"
              className="text-blue-600 text-sm underline hover:no-underline"
            >
              Lupa kata sandi?
            </a>
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Masukkan kata sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Masuk
        </Button>

        <div className="text-center text-sm mt-4 text-gray-700">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-blue-600 underline hover:no-underline"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
