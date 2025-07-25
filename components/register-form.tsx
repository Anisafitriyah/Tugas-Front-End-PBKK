"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { register } from "@/lib/api";
import { useRouter } from "next/navigation";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi tidak cocok.");
      return;
    }

    try {
      const res = await register({ name, email, password });

      toast.success("Registrasi berhasil!");
      setTimeout(() => router.push("/login"), 1000);
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Terjadi kesalahan saat registrasi.";
      toast.error("Registrasi gagal", { description: msg });
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
      <div className="bg-blue-600 p-6 rounded-t-xl text-white text-center">
        <h4 className="text-lg font-semibold">Daftar Akun Baru</h4>
      </div>

      <form onSubmit={handleRegister} className="p-6 space-y-5">
        <div>
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            type="text"
            placeholder="Masukkan nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Buat password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Ulangi password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Daftar
        </Button>

        <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login di sini
          </a>
        </p>
      </form>
    </div>
  );
}
